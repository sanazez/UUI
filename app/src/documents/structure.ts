import {
    ButtonDoc,
    LinkButtonDoc,
    PickerInputDoc,
    PickerModalDoc,
    IconButtonDoc,
    TabButtonDoc,
    TextInputDoc,
    CheckboxDoc,
    RadioInputDoc,
    SwitchDoc,
    CheckboxGroupDoc,
    RadioGroupDoc,
    MultiSwitchDoc,
    NumericInputDoc,
    RatingDoc,
    SearchInputDoc,
    TextAreaDoc,
    AccordionDoc,
    ContextProviderDoc,
    ApiContextDoc,
    ModalContextDoc,
    NotificationContextDoc,
    DropdownDoc,
    MainMenuDoc,
    ModalsDoc,
    BadgeDoc,
    FiltersPanelDoc,
    TagDoc,
    PaginatorDoc,
    SpinnerDoc,
    RichTextViewDoc,
    TextDoc,
    TextPlaceholderDoc,
    DatePickerDoc,
    RangeDatePickerDoc,
    TimePickerDoc,
    ControlGroupDoc,
    InstallationDoc,
    NotificationCardDoc,
    TooltipDoc,
    LabeledInputDoc,
    AlertDoc,
    IconContainerDoc,
    BlockerDoc,
    IconsDoc,
    ColorsPageDoc,
    DownloadsDoc,
    ProjectsDoc,
    ReleaseNotesDoc,
    FlexRowDoc,
    FlexCellDoc,
    FlexSpacerDoc,
    PanelDoc,
    GettingStartedForDesignersDoc,
    RichTextEditorDoc,
    FormDoc,
    LockContextDoc,
    AvatarDoc,
    InternationalizationDoc,
    FileUploadDoc,
    SliderDoc,
    SliderRatingDoc,
    AvatarStackDoc,
    PickerListDoc,
    TeamDoc,
    AnalyticsContextDoc,
    DragAndDropDoc,
    VirtualListDoc,
    EmptyStatesDoc,
    LayoutsDoc,
    LoadersDoc,
    ValidationDoc,
    VisualExamplesDoc,
    DropdownMenuDoc,
    ProgressBarDoc,
    VerticalTabButtonDoc,
    ScrollSpyDoc,
    DropdownContainerDoc,
    AdaptivePanelDoc,
    EditableTablesDoc,
    TablesOverviewDoc,
    AdvancedTablesDoc,
    PresetsPanelDoc,
    GettingStartedDoc,
} from '../docs';
import sortBy from 'lodash.sortby';
import { CoreConceptsDoc } from '../docs/CoreConcepts';
import { AnchorDoc } from '../docs/Anchor.doc';

export interface DocItem {
    id: string;
    name: string;
    component?: any;
    parentId?: string;
    order?: number;
    tags?: string[];
}

const componentsStructure = sortBy(
    [
        {
            id: 'accordion', name: 'Accordion', component: AccordionDoc, parentId: 'components',
        }, {
            id: 'adaptivePanel', name: 'Adaptive Panel', component: AdaptivePanelDoc, parentId: 'components',
        }, {
            id: 'alert', name: 'Alert', component: AlertDoc, parentId: 'components',
        }, {
            id: 'anchor', name: 'Anchor', component: AnchorDoc, parentId: 'components',
        }, {
            id: 'avatar', name: 'Avatar', component: AvatarDoc, parentId: 'components',
        }, {
            id: 'avatarStack', name: 'Avatar Stack', component: AvatarStackDoc, parentId: 'components',
        }, {
            id: 'badge', name: 'Badge', component: BadgeDoc, parentId: 'components',
        }, {
            id: 'blocker', name: 'Blocker', component: BlockerDoc, parentId: 'components',
        }, {
            id: 'button', name: 'Button', component: ButtonDoc, parentId: 'components',
        }, {
            id: 'checkbox', name: 'Checkbox', component: CheckboxDoc, parentId: 'components',
        }, {
            id: 'checkboxGroup', name: 'Checkbox Group', component: CheckboxGroupDoc, parentId: 'components',
        }, {
            id: 'controlGroup', name: 'Control Group', component: ControlGroupDoc, parentId: 'components',
        }, {
            id: 'datePicker', name: 'Date Picker', component: DatePickerDoc, parentId: 'components',
        }, {
            id: 'dropdown', name: 'Dropdown', component: DropdownDoc, parentId: 'components',
        }, {
            id: 'dropdownMenu', name: 'Dropdown Menu', component: DropdownMenuDoc, parentId: 'components',
        }, { id: 'flexItems', name: 'Flex Items', parentId: 'components' }, {
            id: 'panel', name: 'Panel', component: PanelDoc, parentId: 'flexItems', order: 1,
        }, {
            id: 'flexRow', name: 'Flex Row', component: FlexRowDoc, parentId: 'flexItems', order: 2,
        }, {
            id: 'flexCell', name: 'Flex Cell', component: FlexCellDoc, parentId: 'flexItems', order: 3,
        }, {
            id: 'flexSpacer', name: 'Flex Spacer', component: FlexSpacerDoc, parentId: 'flexItems', order: 4,
        }, {
            id: 'iconButton', name: 'Icon Button', component: IconButtonDoc, parentId: 'components',
        }, {
            id: 'iconContainer', name: 'Icon Container', component: IconContainerDoc, parentId: 'components',
        }, {
            id: 'labeledInput', name: 'Labeled Input', component: LabeledInputDoc, parentId: 'components',
        }, {
            id: 'linkButton', name: 'Link Button', component: LinkButtonDoc, parentId: 'components',
        }, {
            id: 'mainMenu', name: 'Main Menu', component: MainMenuDoc, parentId: 'components',
        }, {
            id: 'modals', name: 'Modals', component: ModalsDoc, parentId: 'components',
        }, {
            id: 'multiSwitch', name: 'MultiSwitch', component: MultiSwitchDoc, parentId: 'components',
        }, {
            id: 'notificationCard', name: 'Notification Card', component: NotificationCardDoc, parentId: 'components',
        }, {
            id: 'numericInput', name: 'Numeric Input', component: NumericInputDoc, parentId: 'components',
        }, {
            id: 'paginator', name: 'Paginator', component: PaginatorDoc, parentId: 'components',
        }, {
            id: 'pickerInput', name: 'Picker Input', component: PickerInputDoc, parentId: 'components',
        }, {
            id: 'pickerModal', name: 'Picker Modal', component: PickerModalDoc, parentId: 'components',
        }, {
            id: 'PickerList', name: 'Picker List', component: PickerListDoc, parentId: 'components',
        }, {
            id: 'radioGroup', name: 'Radio Group', component: RadioGroupDoc, parentId: 'components',
        }, {
            id: 'radioInput', name: 'Radio Input', component: RadioInputDoc, parentId: 'components',
        }, {
            id: 'rangeDatePicker', name: 'Range Date Picker', component: RangeDatePickerDoc, parentId: 'components',
        }, {
            id: 'rating', name: 'Rating', component: RatingDoc, parentId: 'components',
        }, {
            id: 'richTextView', name: 'Rich Text View', component: RichTextViewDoc, parentId: 'components',
        }, {
            id: 'searchInput', name: 'Search Input', component: SearchInputDoc, parentId: 'components',
        }, {
            id: 'slider', name: 'Slider', component: SliderDoc, parentId: 'components',
        }, {
            id: 'sliderRating', name: 'Slider Rating', component: SliderRatingDoc, parentId: 'components',
        }, {
            id: 'spinner', name: 'Spinner', component: SpinnerDoc, parentId: 'components',
        }, {
            id: 'switch', name: 'Switch', component: SwitchDoc, parentId: 'components',
        }, {
            id: 'tabButton', name: 'Tab Button', component: TabButtonDoc, parentId: 'components',
        }, {
            id: 'tables', name: 'Data Tables', parentId: 'components', tags: ['table'],
        }, {
            id: 'tablesOverview', name: 'Overview', component: TablesOverviewDoc, parentId: 'tables', order: 1, tags: ['tables', 'dataTable'],
        }, {
            id: 'editableTables', name: 'Editable Tables', component: EditableTablesDoc, parentId: 'tables', order: 2, tags: ['tables', 'dataTable'],
        }, {
            id: 'advancedTables', name: 'Advanced', component: AdvancedTablesDoc, parentId: 'tables', order: 3, tags: ['tables', 'dataTable'],
        }, {
            id: 'filtersPanel', name: 'Filters Panel', component: FiltersPanelDoc, parentId: 'tables', order: 4, tags: ['tables', 'dataTable'],
        }, {
            id: 'presetsPanel', name: 'Presets Panel', component: PresetsPanelDoc, parentId: 'tables', order: 5, tags: ['tables', 'dataTable'],
        }, {
            id: 'tag', name: 'Tag', component: TagDoc, parentId: 'components',
        }, {
            id: 'text', name: 'Text', component: TextDoc, parentId: 'components',
        }, {
            id: 'textArea', name: 'Text Area', component: TextAreaDoc, parentId: 'components',
        }, {
            id: 'textInput', name: 'Text Input', component: TextInputDoc, parentId: 'components',
        }, {
            id: 'textPlaceholder', name: 'Text Placeholder', component: TextPlaceholderDoc, parentId: 'components',
        }, {
            id: 'timePicker', name: 'Time Picker', component: TimePickerDoc, parentId: 'components',
        }, {
            id: 'tooltip', name: 'Tooltip', component: TooltipDoc, parentId: 'components',
        }, {
            id: 'richTextEditor', name: 'Rich Text Editor', component: RichTextEditorDoc, parentId: 'components',
        }, {
            id: 'form', name: 'Form', component: FormDoc, parentId: 'components',
        }, {
            id: 'fileUpload', name: 'File Upload', component: FileUploadDoc, parentId: 'components',
        }, {
            id: 'verticalTabButton', name: 'Vertical Tab Button', component: VerticalTabButtonDoc, parentId: 'components',
        }, {
            id: 'virtualList', name: 'Virtual List', component: VirtualListDoc, parentId: 'components',
        }, {
            id: 'progressBar', name: 'Progress Bar', component: ProgressBarDoc, parentId: 'components',
        }, {
            id: 'scrollSpy', name: 'Scroll Spy', component: ScrollSpyDoc, parentId: 'components',
        }, {
            id: 'dropdownContainer', name: 'Dropdown Container', component: DropdownContainerDoc, parentId: 'components',
        },
    ],
    (item) => (item.order ? item.order + item.name : item.name),
);

export const items: DocItem[] = [
    { id: 'gettingStarted', name: 'Getting Started', component: GettingStartedDoc }, { id: 'installation', name: 'Installation', component: InstallationDoc }, { id: 'coreConcepts', name: 'Core Concepts', component: CoreConceptsDoc }, { id: 'forDesigners', name: 'For Designers' }, {
        id: 'gettingStartedForDesigners', name: 'Getting Started', component: GettingStartedForDesignersDoc, parentId: 'forDesigners',
    }, { id: 'guidelines', name: 'Guidelines', parentId: 'forDesigners' }, {
        id: 'emptyStates', name: 'Empty States', component: EmptyStatesDoc, parentId: 'guidelines',
    }, {
        id: 'layouts', name: 'Layouts', component: LayoutsDoc, parentId: 'guidelines',
    }, {
        id: 'loaders', name: 'Loaders', component: LoadersDoc, parentId: 'guidelines',
    }, {
        id: 'validation', name: 'Validation', component: ValidationDoc, parentId: 'guidelines',
    }, {
        id: 'visualExamples', name: 'Visual Examples', component: VisualExamplesDoc, parentId: 'forDesigners',
    }, { id: 'components', name: 'Components' }, ...componentsStructure, { id: 'advanced', name: 'Advanced' }, {
        id: 'localization', name: 'Internationalization', component: InternationalizationDoc, parentId: 'advanced',
    }, {
        id: 'dragAndDrop', name: 'Drag And Drop', component: DragAndDropDoc, parentId: 'advanced',
    }, { id: 'contexts', name: 'Contexts' }, {
        id: 'contextProvider', name: 'Context Provider', component: ContextProviderDoc, parentId: 'contexts', tags: ['contexts'],
    }, {
        id: 'apiContext', name: 'Api Context and Error Handling', component: ApiContextDoc, parentId: 'contexts', tags: ['contexts'],
    }, {
        id: 'analyticsContext', name: 'Analytics Context', component: AnalyticsContextDoc, parentId: 'contexts', tags: ['contexts'],
    }, {
        id: 'modalContext', name: 'Modal Context', component: ModalContextDoc, parentId: 'contexts', tags: ['contexts'],
    }, {
        id: 'notificationContextDoc', name: 'Notification Context', component: NotificationContextDoc, parentId: 'contexts', tags: ['contexts'],
    }, {
        id: 'lockContextDoc', name: 'Lock Context', component: LockContextDoc, parentId: 'contexts', tags: ['contexts'],
    }, { id: 'assets', name: 'Assets' }, {
        id: 'icons', name: 'Icons', component: IconsDoc, parentId: 'assets',
    }, {
        id: 'promoColors', name: 'Colors', component: ColorsPageDoc, parentId: 'assets',
    }, {
        id: 'downloads', name: 'Downloads', component: DownloadsDoc, parentId: 'assets',
    }, { id: 'projects', name: 'Projects', component: ProjectsDoc }, { id: 'team', name: 'Team', component: TeamDoc }, { id: 'releaseNotes', name: 'Release Notes', component: ReleaseNotesDoc },
];
