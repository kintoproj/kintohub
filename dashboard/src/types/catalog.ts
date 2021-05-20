export const SYSTEM_FIELD_KEY_PRICING_CALCULATOR = 'pricing_calculator';

export default interface CatalogSchema {
  name: string;
  type: string;
  key: string;
  repo: string;
  branch: string;
  tabs: Tab[];
  access: (AccessFieldRef | AccessTemplate)[];
}

export interface AccessFieldRef {
  type: 'fieldRef';
  keyRef: string;
}

export interface AccessTemplate {
  type: 'template';
  label: string;
  template: string;
  isConnectionString?: boolean;
  enabledBy?: string[];
  disabledBy?: string[];
}

export interface Tab {
  label: string;
  sections: Section[];
}

export interface Section {
  title?: string;

  // store the key of a toggle field
  // the whole section will be enabled only if that field is enabled
  enabledBy?: string;
  fields: Field[];
}

export interface Validation {
  type: 'string' | 'number';
  rules: ValidationRule[];
}

export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'password' | 'secret' | 'username';
  value?: any;
  message?: string;
}

export interface FieldMapping {
  key: string;
  // apply this mapping only when the value of the source field match
  when?: any;
  mappedValue: any;
}

export interface BasicField {
  type: string;
  key: string;
  label: string;
  desc?: string;
  default: string | number | boolean;
  editable: boolean;
  alpha?: boolean;
  placeholder?: string;
  validation?: Validation;
  enabledBy?: string;
  alias?: string[];
  hidden?: boolean;
  mappings?: FieldMapping[];
  // will try to stay on same row as previous field
  noWrap?: boolean;
}

export type SystemField = {
  type: 'system';
  key: typeof SYSTEM_FIELD_KEY_PRICING_CALCULATOR;
} & BasicField;

export type SliderField = {
  type: 'slider';
  values: number[];
  unit?: Unit;
  unitGroup?: UnitGroup;
} & BasicField;

export type TextField = {
  type: 'text';
} & BasicField;

export type PasswordField = {
  type: 'password';
  // 'key': only alphabetic characters allowed
  subType?: 'secret';
} & BasicField;

export type SwitchField = {
  type: 'switch';
  default: boolean;
  isProFeature?: boolean;
} & BasicField;

export type Field =
  | SliderField
  | TextField
  | SwitchField
  | PasswordField
  | SystemField;
export type Unit = 'memory' | 'storage' | 'cpu' | 'replica';
export type UnitGroup = 'slave' | 'default';
