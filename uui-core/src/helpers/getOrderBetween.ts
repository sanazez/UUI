import trimEnd from 'lodash.trimend';

const base = 26;
const memoized: string[] = [];

export function numberToOrder(input: number) {
    const existing = memoized[input];
    if (existing) {
        return existing;
    }

    const aChar = 97;
    const digits = [];

    let lastInputValue = input;
    while (lastInputValue > 0) {
        digits.unshift((lastInputValue % base) + aChar);
        lastInputValue = Math.floor(lastInputValue / base);
    }
    const order = String.fromCharCode(
        // put number of digits first, to establish order between numbers of different length (the longer is bigger)
        // '+ 1' is to start number of digits from 'b' to leave room to insert orders before numberToOrder(0), w/o using digits.
        digits.length + aChar + 1,
        ...digits,
    );
    memoized[input] = order;
    return order;
}

export const minOrderStr = '0';
export const maxOrderStr = 'zzzz';

/**
 * Calculates a string, which is between two strings, if strings are sorted in alphabetic order.
 *
 * Examples:
 *
 *  - 'a', 'z' => 's'
 *  - 'a', 'b' => 'as'
 *  - 'as, 'b' => 'au'
 *  - 'aa, 'ab' => 'aas' // there's no precision limit
 *  - null, 'c' => 'b' // insert first
 *  - 'c', null => 'u' // insert last
 *
 * This approach allows to add order to arbitrary list of items.
 *
 * Any item can be moved to any place in the list by modifying only one attribute. So:
 * - you can save only moved item(s) to server, not the whole list
 * - you can store items in any suitable structure, e.g. - Map<id, Item>, instead of plain arrays
 * - server can trivially update items, as usual fields
 * - server can sort items as well - we use only ASCII 0-9 and a-z, to there's no collation issues
 * - it's better than using integer numbers: no need to renumber items in case you need to insert an item between 1 and 2
 * - it's better than using floats: they can have limited precision, which can lead to complicated issues
 *
 * The function implements a basic average of 2 numbers: (a + b)/2, interpreting strings as fractional part of base-36 number.
 *
 * Read more [here](https://uui.epam.com/documents?id=dragAndDrop&mode=doc&skin=UUI4_promo&category=advanced)
 * @param inputA order string before (can be start for the start of the list)
 * @param inputB order string after (can be null for the end of the list)
 * @returns order string between inputA and inputB
 */
export function getOrderBetween(inputA: string | null, inputB: string | null): string {
    const radix = 36;
    let a = inputA;
    let b = inputB || 'z';

    if (!a) {
        // We were generating chars 0-z prior. Now we try yo use only a-z.
        // This is done to avoid issues with string sort/compare algorithms (e.g. Intl.Collator().compare we use in DataSources),
        // which compare number so '1' < '10', and we rely on plain char-by-char comparators.

        // However, there's no options to generate value less than 'a' w/o digits.
        // This can happen for already generated orders.
        a = (b <= 'a') ? '0' : 'a';
    }

    a = trimEnd(a, '0');
    b = trimEnd(b, '0');

    const throwError = () => {
        throw new Error(`getOrderBetween: can't find values between ${inputA} and ${inputB}`);
    };

    if (a >= b) {
        throwError();
    }

    let result = '';
    let n = 0;

    while (true) {
        const aChar = a[n];
        const bChar = b[n];

        let aDigit = parseInt(aChar || '0', radix);
        const bDigit = parseInt(bChar || 'z', radix);

        // We were generating chars 0-z, however now we try to use a-z if possible.
        // Unfortunately, it's not possible, if order already contains digits.
        if (bDigit > 10) {
            aDigit = Math.max(10, aDigit);
        }

        const midDigit = Math.floor((aDigit + bDigit) / 2);

        result += midDigit.toString(radix);

        if (aDigit !== midDigit) {
            break;
        }

        n++;
    }

    return result;
}
