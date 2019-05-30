/*
 * Public API Surface of ui-framework
 */

/*
 * Typography
 */

// Typography Module
export { TypographyModule } from './lib/typography/typography.module';

/*
 * Buttons & Indicators
 */

// Icons Module
export { IconsModule } from './lib/icons/icons.module';
export { IconComponent } from './lib/icons/icon.component';
export { IconSize, IconColor, Icons } from './lib/icons/icons.enum';
// Buttons Module
export { ButtonsModule } from './lib/buttons-indicators/buttons/buttons.module';
export {
  ButtonComponent
} from './lib/buttons-indicators/buttons/button/button.component';
export {
  SquareButtonComponent
} from './lib/buttons-indicators/buttons/square/square.component';
export {
  GroupComponent
} from './lib/buttons-indicators/buttons/group/group.component';
export {
  BackButtonComponent
} from './lib/buttons-indicators/buttons/back-button/back-button.component';
export {
  ButtonType,
  ButtonSize,
  BackButtonType
} from './lib/buttons-indicators/buttons/buttons.enum';
// Add File Module
export { AddFileModule } from './lib/buttons-indicators/add-file/add-file.module';
export { AddFileComponent } from './lib/buttons-indicators/add-file/add-file.component';
// Avatar Module
export { AvatarModule } from './lib/buttons-indicators/avatar/avatar.module';
export {
  AvatarComponent
} from './lib/buttons-indicators/avatar/avatar.component';
export { AvatarSize, AvatarOrientation, AvatarBadge } from './lib/buttons-indicators/avatar/avatar.enum';
export { BadgeConfig } from './lib/buttons-indicators/avatar/avatar.interface';
// Slider Module
export { SliderModule } from './lib/buttons-indicators/slider/slider.module';
export {
  SliderComponent
} from './lib/buttons-indicators/slider/slider.component';
// SwitchToggle Module
export {
  SwitchToggleModule
} from './lib/buttons-indicators/switch-toggle/switch-toggle.module';
export {
  SwitchToggleComponent
} from './lib/buttons-indicators/switch-toggle/switch-toggle.component';
// Chips Module
export { ChipsModule } from './lib/buttons-indicators/chips/chips.module';
export {
  ChipComponent
} from './lib/buttons-indicators/chips/chip/chip.component';
export { ChipInputComponent } from './lib/buttons-indicators/chips/chip-input/chip-input.component';
export { ChipType } from './lib/buttons-indicators/chips/chips.enum';
export { Chip } from './lib/buttons-indicators/chips/chips.interface';
// InfoStrip Module
export { InfoStripModule } from './lib/buttons-indicators/info-strip/info-strip.module';
export { InfoStripComponent } from './lib/buttons-indicators/info-strip/info-strip.component';
export { InfoStripIconType } from './lib/buttons-indicators/info-strip/info-strip.enum';
// Link Module
export { LinkModule } from './lib/buttons-indicators/link/link.module';
export { LinkComponent } from './lib/buttons-indicators/link/link.component';
export { Link } from './lib/buttons-indicators/link/link.types';
export { LinkColor, LinkTarget } from './lib/buttons-indicators/link/link.enum';
// InfoTooltip Module
export { InfoTooltipModule } from './lib/popups/info-tooltip/info-tooltip.module';
export { InfoTooltipComponent } from './lib/popups/info-tooltip/info-tooltip.component';
// Employees Showcase Module
export { EmployeesShowcaseModule } from './lib/buttons-indicators/employees-showcase/employees-showcase.module';
export { EmployeesShowcaseComponent } from './lib/buttons-indicators/employees-showcase/employees-showcase.component';
export { EmployeeShowcase } from './lib/buttons-indicators/employees-showcase/employees-showcase.interface';
/*
 * Form Elements
 */

// FormElements Module
export { FormElementsModule } from './lib/form-elements/form-elements.module';
// Textarea Module
export { TextareaModule } from './lib/form-elements/textarea/textarea.module';
export {
  TextareaComponent
} from './lib/form-elements/textarea/textarea.component';
// Checkbox Module
export { CheckboxModule } from './lib/form-elements/checkbox/checkbox.module';
export {
  CheckboxComponent
} from './lib/form-elements/checkbox/checkbox.component';
// DatePicker Module
export {
  DatepickerModule
} from './lib/form-elements/datepicker/datepicker.module';
export {
  DatepickerComponent
} from './lib/form-elements/datepicker/datepicker.component';
// Input Module
export { InputModule } from './lib/form-elements/input/input.module';
export { InputComponent } from './lib/form-elements/input/input.component';
export { InputEvent } from './lib/form-elements/input/input.interface';
export {
  InputTypes,
  InputEventType,
  InputAutoCompleteOptions
} from './lib/form-elements/input/input.enum';
// Split input + single select Module
export {
  SplitInputSingleSelectModule
} from './lib/form-elements/split-input-single-select/split-input-single-select.module';
export {
  SplitInputSingleSelectComponent
} from './lib/form-elements/split-input-single-select/split-input-single-select.component';
export {
  InputSingleSelectValue
} from './lib/form-elements/split-input-single-select/split-input-single-select.interface';
// Lists Module
export {
  SingleListModule
} from './lib/form-elements/lists/single-list/single-list.module';
export {
  SingleListComponent
} from './lib/form-elements/lists/single-list/single-list.component';
export {
  SingleSelectModule
} from './lib/form-elements/lists/single-select/single-select.module';
export {
  SingleSelectComponent
} from './lib/form-elements/lists/single-select/single-select.component';
export {
  MultiListModule
} from './lib/form-elements/lists/multi-list/multi-list.module';
export {
  MultiListComponent
} from './lib/form-elements/lists/multi-list/multi-list.component';
export {
  MultiSelectModule
} from './lib/form-elements/lists/multi-select/multi-select.module';
export {
  MultiSelectComponent
} from './lib/form-elements/lists/multi-select/multi-select.component';
export {
  SelectGroupOption,
  SelectOption,
  ListComponentPrefix
} from './lib/form-elements/lists/list.interface';
export { ListChange } from './lib/form-elements/lists/list-change/list-change';
// Rich Text Editor
export {
  RichTextEditorModule
} from './lib/form-elements/rich-text-editor/rte.module';
export {
  RTEType, BlotType, RTEchangeEvent
} from './lib/form-elements/rich-text-editor/rte-core/rte.enum';
export {
  RichTextEditorComponent
} from './lib/form-elements/rich-text-editor/rte.component';
// Radio Buttons
export {
  RadioButtonModule
} from './lib/form-elements/radio-button/radio-button.module';
export {
  RadioButtonComponent
} from './lib/form-elements/radio-button/radio-button.component';
export {
  RadioDirection
} from './lib/form-elements/radio-button/radio-button.enum';
export {
  RadioConfig
} from './lib/form-elements/radio-button/radio-button.interface';

/*
 * Navigation
 */

// Search
export { SearchModule } from './lib/search/search/search.module';
export { SearchComponent } from './lib/search/search/search.component';
// Auto complete Module
export {
  AutoCompleteModule
} from './lib/search/auto-complete/auto-complete.module';
export {
  AutoCompleteComponent
} from './lib/search/auto-complete/auto-complete.component';
// Quick Filters Module
export {
  QuickFilterModule
} from './lib/search/quick-filter/quick-filter.module';
export {
  QuickFilterComponent
} from './lib/search/quick-filter/quick-filter.component';
export {
  QuickFilterConfig,
  QuickFilterChangeEvent,
  QuickFilterBarChangeEvent
} from './lib/search/quick-filter/quick-filter.interface';
export { QuickFilterSelectType } from './lib/search/quick-filter/quick-filter.enum';
// Menu Module
export { MenuModule } from './lib/navigation/menu/menu.module';
export { MenuComponent } from './lib/navigation/menu/menu.component';
export { MenuItem } from './lib/navigation/menu/menu.interface';
// Side Menu Module
export { SideMenuModule } from './lib/navigation/side-menu/side-menu.module';
export {
  SideMenuComponent
} from './lib/navigation/side-menu/side-menu.component';
export {
  SideMenuOption
} from './lib/navigation/side-menu/side-menu-option/side-menu-option.interface';
// Tabs Module
export { TabsModule } from './lib/navigation/tabs/tabs.module';
export { TabsComponent } from './lib/navigation/tabs/tabs.component';
export { Tab } from './lib/navigation/tabs/tabs.interface';
// Breadcrumbs Module
export {
  BreadcrumbsModule
} from './lib/navigation/breadcrumbs/breadcrumbs.module';
export {
  BreadcrumbsComponent
} from './lib/navigation/breadcrumbs/breadcrumbs.component';
export {
  Breadcrumb,
  BreadcrumbNavButtons,
  BreadcrumbNavButton
} from './lib/navigation/breadcrumbs/breadcrumbs.interface';
export { BaseFormElement } from './lib/form-elements/base-form-element';


/*
 * Overlays
 */

// Panel Module
export { PanelModule } from './lib/popups/panel/panel.module';
export { PanelComponent } from './lib/popups/panel/panel.component';
// Dialog Module
export { DialogModule } from './lib/popups/dialog/dialog.module';
export { DialogComponent } from './lib/popups/dialog/dialog.component';
export { DialogSize } from './lib/popups/dialog/dialog.enum';
export {
  DialogConfig,
  DialogButtons,
  DialogButton
} from './lib/popups/dialog/dialog.interface';
export {
  DialogService
} from './lib/popups/dialog/dialog-service/dialog.service';

/*
 * Table
 */

// Table Module
export { TableModule } from './lib/table/table.module';
export * from './lib/table/table/table.interface';
export { TableComponent } from './lib/table/table/table.component';
export { AvatarCellComponent } from './lib/table/table-cell-components/avatar.component';
export { ActionsCellComponent } from './lib/table/table-cell-components/actions-cell/actions-cell.component';
export { GridActions } from './lib/table/table-cell-components/actions-cell/actions-cell.interface';
export { TableUtilsService } from './lib/table/table-utils-service/table-utils.service';

/*
 * Layout
 */
// Divider
export { DividerModule } from './lib/layout/divider/divider.module';
export { DividerComponent } from './lib/layout/divider/divider.component';
// Cards
export { CardsModule } from './lib/cards/cards.module';
export { CardType } from './lib/cards/cards.enum';
export { CardDataType, CardData, AddCardData, CardClickEvent } from './lib/cards/cards.interface';
// Single card
export { CardComponent } from './lib/cards/card/card.component';
// Add new Card
export { CardAddComponent } from './lib/cards/card-add/card-add.component';
// Cards Layout
export { CardsLayoutComponent } from './lib/cards/cards-layout/cards-layout.component';
// Card Table
export { CardTableModule } from './lib/table/card-table/card-table.module';
export { CardTableComponent } from './lib/table/card-table/card-table/card-table.component';
export * from './lib/table/card-table/card-table.interface';
// Collapsible
export { CollapsibleModule } from './lib/layout/collapsible/collapsible.module';
export { CollapsibleComponent } from './lib/layout/collapsible/collapsible.component';
export { CollapsibleType } from './lib/layout/collapsible/collapsible.enum';

/*
 * Misc
 */

// Preloader
export {
  MiniPreloaderModule
} from './lib/buttons-indicators/mini-preloader/mini-preloader.module';
export {
  MiniPreloaderComponent
} from './lib/buttons-indicators/mini-preloader/mini-preloader.component';
// Filter Module
export { FiltersModule } from './lib/services/filters/filters.module';
// Utils Module
export { UtilsModule } from './lib/services/utils/utils.module';
export { UtilsService } from './lib/services/utils/utils.service';
export { DOMhelpers } from './lib/services/utils/dom-helpers.service';
export { ScrollEvent }  from './lib/services/utils/utils.interface';
// Component Renderer
export { ComponentRendererModule } from './lib/services/component-renderer/component-renderer.module';
export { ComponentRendererComponent } from './lib/services/component-renderer/component-renderer.component';
export { RenderedComponent } from './lib/services/component-renderer/component-renderer.interface';
// Truncate Tooltip
export { TruncateTooltipModule} from './lib/services/truncate-tooltip/truncate-tooltip.module';
export { TruncateTooltipComponent} from './lib/services/truncate-tooltip/truncate-tooltip.component';
export { TruncateTooltipDirective } from './lib/services/truncate-tooltip/truncate-tooltip.directive';

/*
* Animation
 */

export { SLIDE_UP_DOWN } from './lib/style/animations';
