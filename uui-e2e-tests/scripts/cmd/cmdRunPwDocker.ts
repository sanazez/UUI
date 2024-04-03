import { spawnProcessSync, hasCliArg } from '../cliUtils';
import {
    CLI_ARGS,
    DOCKER_CONTAINER_NAME,
    DOCKER_FILES,
    DOCKER_IMAGE_TAGS,
    YARN_TASKS,
} from '../constants';
import { currentMachineIpv4 } from '../ipUtils';
import { readEnvFile } from '../envFileUtils';

const envFile = readEnvFile();
const UUI_DOCKER_CONTAINER_MGMT = envFile.UUI_DOCKER_CONTAINER_MGMT || 'podman';

main();

function main() {
    spawnProcessSync({
        cmd: UUI_DOCKER_CONTAINER_MGMT,
        args: [
            'build',
            '-t',
            DOCKER_IMAGE_TAGS.TEST,
            '-f',
            DOCKER_FILES.DOCKER_FILE,
            '.',
        ],
        cwd: process.cwd(),
        exitOnErr: true,
    });
    spawnProcessSync({
        cmd: UUI_DOCKER_CONTAINER_MGMT,
        args: [
            'rm',
            DOCKER_CONTAINER_NAME,
        ],
        cwd: process.cwd(),
        exitOnErr: false,
    });
    const updateSnapshots = hasCliArg(CLI_ARGS.PW_DOCKER_UPDATE_SNAPSHOTS);
    spawnProcessSync({
        cmd: UUI_DOCKER_CONTAINER_MGMT,
        args: [
            'run',
            '--name',
            DOCKER_CONTAINER_NAME,
            '--cap-add',
            'SYS_ADMIN',
            '-it',
            '--network',
            'host',
            '--ipc',
            'host',
            ...getVolumesMapArgs(),
            '-e',
            'UUI_IS_DOCKER=true',
            '-e',
            `UUI_DOCKER_HOST_MACHINE_IP=${currentMachineIpv4}`,
            DOCKER_IMAGE_TAGS.TEST,
            'yarn',
            updateSnapshots ? YARN_TASKS.DOCKER_TEST_E2E_UPDATE : YARN_TASKS.DOCKER_TEST_E2E,
        ],
        cwd: process.cwd(),
        exitOnErr: true,
    });
}

function getVolumesMapArgs() {
    const volumesMap: Record<string, string> = {
        './scripts': '/app/scripts',
        './src': '/app/src',
        './tests': '/app/tests',
        './playwright.config.ts': '/app/playwright.config.ts',
        './.env.ci': '/app/.env.ci',
        './.env.local': '/app/.env.local',
    };
    return Object.keys(volumesMap).reduce<string[]>((acc, key) => {
        const value = volumesMap[key];
        acc.push('-v');
        acc.push(`${key}:${value}`);
        return acc;
    }, []);
}
