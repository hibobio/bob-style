/*
 * Public API Surface of ui-framework
 */


/*
* Global
*/

export * from './lib/enums';
export * from './lib/types';
export { serverDateFormat, mobileBreakpoint } from './lib/consts';

/*
 * Typography
 */

// Typography Module
export { TypographyModule } from './lib/typography/typography.module';
// LabelValue Module
export { LabelValueModule } from './lib/typography/label-value/label-value.module';
export { LabelValueComponent } from './lib/typography/label-value/label-value.component';
export { LabelValueType, TextAlign, IconPosition } from './lib/typography/label-value/label-value.enum';

/*
 * Buttons
 */

export { ButtonsModule } from './lib/buttons/buttons.module';
export {
  ButtonComponent
} from './lib/buttons/button/button.component';
export {
  SquareButtonComponent
} from './lib/buttons/square/square.component';
export {
  GroupComponent
} from './lib/buttons/group/group.component';
export {
  BackButtonComponent
} from './lib/buttons/back-button/back-button.component';
export {
  ChevronButtonComponent
} from './lib/buttons/chevron-button/chevron-button.component';
export {
  TextButtonComponent
} from './lib/buttons/text-button/text-button.component';
export {
  ButtonType,
  ButtonSize,
  BackButtonType
} from './lib/buttons/buttons.enum';

/*
 * Avatar
 */

// Avatar Module
export { AvatarModule } from './lib/avatar/avatar/avatar.module';
export {
  AvatarComponent
} from './lib/avatar/avatar/avatar.component';
export { AvatarSize, AvatarOrientation, AvatarBadge } from './lib/avatar/avatar/avatar.enum';
export { BadgeConfig, Avatar } from './lib/avatar/avatar/avatar.interface';
// Employees Showcase Module
export { EmployeesShowcaseModule } from './lib/avatar/employees-showcase/employees-showcase.module';
export { EmployeesShowcaseComponent } from './lib/avatar/employees-showcase/employees-showcase.component';
export { EmployeeShowcase } from './lib/avatar/employees-showcase/employees-showcase.interface';


/*
 * Indicators
 */

// Preloader
export {
  MiniPreloaderModule
} from './lib/buttons-indicators/mini-preloader/mini-preloader.module';
export {
  MiniPreloaderComponent
} from './lib/buttons-indicators/mini-preloader/mini-preloader.component';
// Add File Module
export { AddFileModule } from './lib/buttons-indicators/add-file/add-file.module';
export { AddFileComponent } from './lib/buttons-indicators/add-file/add-file.component';
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
// InfoStrip Module
export { InfoStripModule } from './lib/buttons-indicators/info-strip/info-strip.module';
export { InfoStripComponent } from './lib/buttons-indicators/info-strip/info-strip.component';
export { InfoStripIconType } from './lib/buttons-indicators/info-strip/info-strip.enum';
// Link Module
export { LinkModule } from './lib/buttons-indicators/link/link.module';
export { LinkComponent } from './lib/buttons-indicators/link/link.component';
export { Link } from './lib/buttons-indicators/link/link.types';
export { LinkColor, LinkTarget } from './lib/buttons-indicators/link/link.enum';
// Empty State Module
export { EmptyStateModule } from './lib/buttons-indicators/empty-state/empty-state.module';
export { EmptyStateComponent } from './lib/buttons-indicators/empty-state/empty-state.component';
export { EmptyStateConfig } from './lib/buttons-indicators/empty-state/empty-state.types';

/*
* Comments
*/

export { CommentsModule } from './lib/comments/comments.module';
export { CommentListComponent } from './lib/comments/comment-list/comment-list.component';
export { EditCommentComponent } from './lib/comments/edit-comment/edit-comment.component';

/*
* Chips
*/

// Chip Module
export { ChipsModule } from './lib/chips/chips.module';
export { ChipType, ChipListAlign, ChipListSelectable } from './lib/chips/chips.enum';
export { Chip, ChipListConfig, ChipKeydownEvent, ChipInputChange } from './lib/chips/chips.interface';
// Single Chip
export { ChipModule } from './lib/chips/chip/chip.module';
export {
  ChipComponent
} from './lib/chips/chip/chip.component';
// Chip List
export { ChipListModule } from './lib/chips/chip-list/chip-list.module';
export { EmojiChipListModule } from './lib/chips/emoji-chip-list/emoji-chip-list.module';
export { EmojiChipListComponent } from './lib/chips/emoji-chip-list/emoji-chip-list.component';
export { ChipListComponent } from './lib/chips/chip-list/chip-list.component';
// Chip Input
export { ChipInputModule } from './lib/chips/chip-input/chip-input.module';
export { ChipInputComponent } from './lib/chips/chip-input/chip-input.component';
// Multi List and Chips
export { MultiListAndChipsModule } from './lib/chips/multi-list-and-chips/multi-list-and-chips.module';
export { MultiListAndChipsComponent } from './lib/chips/multi-list-and-chips/multi-list-and-chips.component';


/*
 * Form Elements
 */

// FormElements Module
export { FormElementsModule } from './lib/form-elements/form-elements.module';
export {
  FormEvents, InputEventType,
} from './lib/form-elements/form-elements.enum';
export { BaseFormElement } from './lib/form-elements/base-form-element';
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
export { DatepickerType } from './lib/form-elements/datepicker/datepicker.enum';
// DateRangePickerModule
export { DateRangePickerModule } from './lib/form-elements/date-range-picker/date-range-picker.module';
export { DateRangePickerComponent } from './lib/form-elements/date-range-picker/date-range-picker.component';
export { DateRangePickerValue } from './lib/form-elements/date-range-picker/date-range-picker.interface';
// Input Module
export { InputModule } from './lib/form-elements/input/input.module';
export { InputComponent } from './lib/form-elements/input/input.component';
export { InputEvent } from './lib/form-elements/input/input.interface';
export {
  InputTypes, InputAutoCompleteOptions
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
// Single select panel
export { SingleSelectPanelModule } from './lib/form-elements/lists/single-select-panel/single-select-panel.module';
export {
  SingleSelectPanelComponent,
} from './lib/form-elements/lists/single-select-panel/single-select-panel.component';
// Multi select panel
export { MultiSelectPanelModule } from './lib/form-elements/lists/multi-select-panel/multi-select-panel.module';
export {
  MultiSelectPanelComponent,
} from './lib/form-elements/lists/multi-select-panel/multi-select-panel.component';
// Chain select
export {
  ChainSelectEventEnum
} from './lib/form-elements/lists/chain-select/chain-select.enum';
export {
  ChainSelectEvent
} from './lib/form-elements/lists/chain-select/chain-select.interface';
export {
  ChainSelectComponent
} from './lib/form-elements/lists/chain-select/chain-select.component';
export {
  ChainSelectModule
} from './lib/form-elements/lists/chain-select/chain-select.module';
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
// Social Module
export { SocialModule } from './lib/form-elements/social/social.module';
export { Social } from './lib/form-elements/social/social.enum';
// Timepicker
export { TimePickerModule } from './lib/form-elements/timepicker/timepicker.module';
export { TimePickerComponent } from './lib/form-elements/timepicker/timepicker.component';
// Password Input
export { PasswordInputModule } from './lib/form-elements/password-input/password-input.module';
export { PasswordInputComponent } from './lib/form-elements/password-input/password-input.component';

/*
 * Search
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

/*
 * Navigation
 */

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
export { TabsType } from './lib/navigation/tabs/tabs.enum';
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
export { BreadcrumbsType } from './lib/navigation/breadcrumbs/breadcrumbs.enum';
// Action Bar
export { ActionBarModule } from './lib/navigation/action-bar/action-bar.module';
export { ActionBarComponent } from './lib/navigation/action-bar/action-bar.component';


/*
 * Overlays & Popups
 */

// Panel Module
export { PanelModule } from './lib/popups/panel/panel.module';
export { PanelComponent } from './lib/popups/panel/panel.component';
export { PanelSize, PanelDefaultPosVer } from './lib/popups/panel/panel.enum';
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
// Confirmation dialog module
export { ConfirmationDialogModule } from './lib/popups/confirmation-dialog/confirmation-dialog.module';
export { ConfirmationDialogComponent } from './lib/popups/confirmation-dialog/confirmation-dialog.component';
export { ConfirmationDialogConfig } from './lib/popups/confirmation-dialog/confirmation-dialog.interface';
export { ConfirmationDialogService } from './lib/popups/confirmation-dialog/confirmation-dialog.service';
// Alert Module
export { AlertModule } from './lib/popups/alert/alert.module';
export { AlertService } from './lib/popups/alert/alert-service/alert.service';
export { AlertComponent } from './lib/popups/alert/alert/alert.component';
export { AlertConfig } from './lib/popups/alert/alert.interface';
export { AlertType } from './lib/popups/alert/alert.enum';
// Lightbox Module
export { LightboxModule } from './lib/popups/lightbox/lightbox.module';
export { LightboxService } from './lib/popups/lightbox/lightbox.service';
export { LightboxComponent } from './lib/popups/lightbox/lightbox.component';
export { MediaEmbedComponent } from './lib/popups/lightbox/media-embed/media-embed.component';
export { LightboxConfig, LightboxData } from './lib/popups/lightbox/lightbox.interface';
// InfoTooltip Module
export { InfoTooltipModule } from './lib/popups/info-tooltip/info-tooltip.module';
export { InfoTooltipComponent } from './lib/popups/info-tooltip/info-tooltip.component';
// Emoji Module
export { EmojiModule } from './lib/popups/emoji/emoji.module';
export { EmojiComponent } from './lib/popups/emoji/emoji.component';
export { Emoji } from './lib/popups/emoji/emoji.interface';
// Truncate Tooltip
export { TruncateTooltipModule } from './lib/popups/truncate-tooltip/truncate-tooltip.module';
export { TruncateTooltipComponent } from './lib/popups/truncate-tooltip/truncate-tooltip.component';
export { TruncateTooltipDirective } from './lib/popups/truncate-tooltip/truncate-tooltip.directive';
export { TruncateTooltipType, TruncateTooltipPosition } from './lib/popups/truncate-tooltip/truncate-tooltip.enum';
// CSS Tooltip
export {
  CSSTooltipWrap,
  CSSTooltipPosition,
  CSSTooltipShowOn,
  CSSTooltipTextAlign
} from './lib/popups/css-tooltip/css-tooltip.enum';

/*
 * Tables
 */

// Table Module
export { TableModule } from './lib/table/table.module';
export * from './lib/table/table/table.interface';
export * from './lib/table/table/table.enum';
export { TableComponent } from './lib/table/table/table.component';
export { AvatarCellComponent } from './lib/table/table-cell-components/avatar-cell/avatar.component';
export { ActionsCellComponent } from './lib/table/table-cell-components/actions-cell/actions-cell.component';
export { GridActions } from './lib/table/table-cell-components/actions-cell/actions-cell.interface';
export { TableUtilsService } from './lib/table/table-utils-service/table-utils.service';
// Card Table
export { CardTableModule } from './lib/table/card-table/card-table.module';
export { CardTableComponent } from './lib/table/card-table/card-table/card-table.component';
export * from './lib/table/card-table/card-table.interface';

/*
 * Layout
 */

// Divider
export { DividerModule } from './lib/layout/divider/divider.module';
export { DividerComponent } from './lib/layout/divider/divider.component';
// Collapsible Section
export { CollapsibleSectionModule } from './lib/layout/collapsible-section/collapsible-section.module';
export { CollapsibleSectionComponent } from './lib/layout/collapsible-section/collapsible-section.component';
export { CollapsibleOptions } from './lib/layout/collapsible-section/collapsible-section.interface';

/*
 * Cards
 */

// Cards
export { CardsModule } from './lib/cards/cards.module';
export { CardType } from './lib/cards/cards.enum';
// Single card
export { CardComponent } from './lib/cards/card/card.component';
export { Card, CardActionButton } from './lib/cards/card/card.interface';
// Add new Card
export { CardAddComponent } from './lib/cards/card-add/card-add.component';
export { AddCard } from './lib/cards/card-add/card-add.interface';
// Employee Card
export { CardEmployeeComponent } from './lib/cards/card-employee/card-employee.component';
export {
  CardEmployee, CardEmployeeSocial, CardEmployeeCoverColors,
} from './lib/cards/card-employee/card-employee.interface';
// Cards Layout
export { CardsLayoutComponent } from './lib/cards/cards-layout/cards-layout.component';

/*
 * Misc
 */

// Icons Module
export { IconsModule } from './lib/icons/icons.module';
export { IconComponent } from './lib/icons/icon.component';
export { IconSize, IconColor, Icons } from './lib/icons/icons.enum';
// Filter Module
export { FiltersModule } from './lib/services/filters/filters.module';
export { LinkifyPipe } from './lib/services/filters/linkify.pipe';
export { HighlightPipe } from './lib/services/filters/highlight.pipe';
// Utils Module
export { UtilsModule } from './lib/services/utils/utils.module';
export { UtilsService } from './lib/services/utils/utils.service';
export { DOMhelpers } from './lib/services/utils/dom-helpers.service';
export { ScrollEvent } from './lib/services/utils/utils.interface';
export { WindowRef } from './lib/services/utils/window-ref.service';
export { DocumentRef } from './lib/services/utils/document-ref.service';
export { MobileService, WidthMode, MediaEvent } from './lib/services/utils/mobile.service';
export { simpleUID } from './lib/services/utils/functional-utils';
// URL utils
export { UrlUtilsModule } from './lib/services/url/url-utils.module';
export { URLutils } from './lib/services/url/url-utils.service';
export { URLtype } from './lib/services/url/url.enum';
export { VideoData } from './lib/services/url/url.interface';
export { allowedDomainsTest, naiveLinkTest, imageLinkTest } from './lib/services/url/url.const';
// Component Renderer
export { ComponentRendererModule } from './lib/services/component-renderer/component-renderer.module';
export { ComponentRendererComponent } from './lib/services/component-renderer/component-renderer.component';
export { RenderedComponent } from './lib/services/component-renderer/component-renderer.interface';
// RxJs operators
export { outsideZone, insideZone } from './lib/services/utils/rxjs.operators';
// Event Manager Plugins
export {
  EventManagerPlugins,
  OutsideZonePlugin,
  MultiEventPlugin,
} from './lib/services/utils/eventManager.plugins';
// Eye Candy
export { EyeCandyModule } from './lib/eye-candy/eye-candy.module';
export { FloatingAvatarsComponent } from './lib/eye-candy/floating-avatars/floating-avatars.component';
// text colored links
export { TextColoredLinksModule } from './lib/eye-candy/text-colored-links/text-colored-links.module';
export {
  TextColoredLinksComponent
} from
  './lib/eye-candy/text-colored-links/text-colored-links/text-colored-links.component';
export { ColorTextItem } from './lib/eye-candy/text-colored-links/text-colored-links.interface';
// Mocks
export * from './lib/mock.const';
// Misc helper methods
export * from './lib/services/utils/functional-utils';
// Test helpers
export * from './lib/services/utils/test-helpers';

/*
* Animation
 */
export { SLIDE_UP_DOWN } from './lib/style/animations';
