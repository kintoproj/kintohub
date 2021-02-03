import BasicLinkButton from 'components/atoms/BasicLinkButton';
import FormikTextField from 'components/atoms/FormikTextField';
import { FlexEndRow } from 'components/atoms/Row';
import { VerticalSpacer } from 'components/atoms/Spacer';
import StyledForm from 'components/atoms/StyledForm';
import TwoColumns from 'components/atoms/TwoColumns';
import ResponsiveSlider from 'components/molecules/ResponsiveSlider';
import ResponsiveSwitch from 'components/molecules/ResponsiveSwitch';
import { FormikProps } from 'formik';
import {
  generateKey,
  generatePassword,
  getSliderOptions,
} from 'libraries/helpers';
import { toHumanReadableUnit } from 'libraries/helpers/catalog';
import _get from 'lodash.get';
import React from 'react';
import styled from 'styled-components';
import CatalogSchema, {
  Field,
  Section,
  SYSTEM_FIELD_KEY_PRICING_CALCULATOR,
} from 'types/catalog';

import { Collapse, Divider, Typography } from '@material-ui/core';
import { REACT_APP_ALPHA_FEATURE_ENABLED } from 'libraries/envVars';
import { AlphaBadge } from 'components/atoms/BetaBadge';

const StyledDiv = styled.div`
  .field-container {
    width: 100%;
    padding: 48px 40px;
    box-sizing: border-box;
  }

  .generate-password-button {
    span {
      font-size: 12px;
    }
  }

  .row-wrapper {
    display: flex;
    margin-bottom: 16px;
    min-height: 84px;
    flex-direction: column;
  }

  .title-wrapper {
    width: 100%;
  }

  .title {
    color: ${(props) => props.theme.palette.text.primary};
  }
  .sub-title {
    color: ${(props) => props.theme.palette.text.secondary};
  }
`;

type Props = {
  isEdit: boolean;
  formikProps: FormikProps<any>;
  sections: Section[];
  schema: CatalogSchema; // as a reference to read the values
};

export type RenderFieldOption = {
  isEditMode?: boolean;
  forceDisable?: boolean;
};

// determine the field should be rendered, only if there is a parent toggle exists.
export const isFieldCollapsed = (
  field: Field,
  formikProps: FormikProps<any>
): boolean => {
  return field.enabledBy
    ? !_get(formikProps.values, field.enabledBy, false)
    : false;
};

export const renderField = (
  schema: CatalogSchema,
  field: Field,
  formikProps: FormikProps<any>,
  options?: RenderFieldOption
): React.ReactChild => {
  let node: React.ReactNode = null;
  const fieldEditable = !options?.isEditMode || field.editable;
  const fieldDisabled = options?.forceDisable || !fieldEditable;
  const isAlphaFeature = field.alpha && REACT_APP_ALPHA_FEATURE_ENABLED;

  switch (field.type) {
    case 'switch': {
      node = (
        <ResponsiveSwitch
          title={field.label}
          subTitle={field.desc || ''}
          name={field.key}
          disabled={fieldDisabled}
          shouldShowAlpha={isAlphaFeature}
        />
      );
      break;
    }

    case 'slider':
      node = (
        <ResponsiveSlider
          name={field.key}
          title={field.label}
          subTitle={field.desc || ''}
          renderValue={() => {
            return toHumanReadableUnit(
              field.values[_get(formikProps.values, field.key, 0)],
              field.unit
            );
          }}
          disabled={fieldDisabled}
          {...getSliderOptions(field.values)}
        />
      );
      break;
    case 'password': {
      const isSecret = field.subType === 'secret';
      node = (
        <>
          <FormikTextField
            label={field.label}
            name={field.key}
            variant="outlined"
            type="password"
            autoComplete="one-time-code"
            disabled={fieldDisabled}
            onBlur={(evt) => {
              // add a little delay to the blur function
              // so when the user click on the `generate` button it won't throw error
              evt.persist();
              setTimeout(() => {
                formikProps.handleBlur(evt);
              }, 100);
            }}
          />
          {!fieldDisabled && (
            <FlexEndRow>
              {isSecret ? (
                <BasicLinkButton
                  className="generate-password-button"
                  data-cy={`generate-key-button-${field.key}`}
                  onClick={() => {
                    formikProps.setFieldValue(field.key, generateKey(32));
                  }}
                >
                  Generate Secret
                </BasicLinkButton>
              ) : (
                <BasicLinkButton
                  className="generate-password-button"
                  data-cy={`generate-password-button-${field.key}`}
                  onClick={() => {
                    formikProps.setFieldValue(field.key, generatePassword(32));
                  }}
                >
                  Generate Password
                </BasicLinkButton>
              )}
            </FlexEndRow>
          )}
        </>
      );
      break;
    }

    case 'system': {
      if (field.key === SYSTEM_FIELD_KEY_PRICING_CALCULATOR) {
        node = (
          <>
            <VerticalSpacer size={16} />
            <Divider />
            <VerticalSpacer size={16} />
          </>
        );
      }
      break;
    }
    case 'text':
    default:
      node = (
        <FormikTextField
          label={field.label}
          name={field.key}
          helperText={field.desc}
          variant="outlined"
          disabled={fieldDisabled}
          endAdornment={isAlphaFeature && <AlphaBadge />}
        />
      );
  }
  // if there is a paraent determine the state of the component, wrap it with collapsable
  const enabledBy = field.enabledBy
    ? _get(formikProps.values, field.enabledBy, false)
    : false;

  if (field.hidden || (field.alpha && !REACT_APP_ALPHA_FEATURE_ENABLED)) {
    return <></>;
  }

  if (field.enabledBy !== undefined) {
    return (
      <Collapse in={enabledBy} timeout="auto" unmountOnExit>
        <div className="row-wrapper">{node}</div>
      </Collapse>
    );
  }

  return <div className="row-wrapper">{node}</div>;
};

export default ({ sections, formikProps, isEdit, schema }: Props) => {
  const isSectionEnabled = (section: Section): boolean => {
    if (!section.enabledBy) {
      return true;
    }

    return _get(formikProps.values, section.enabledBy, false);
  };

  const renderFields = (section: Section) => {
    const fields: React.ReactNode[] = [];
    let i = 0;
    while (i < section.fields.length) {
      const field = section.fields[i];
      const nextField =
        section.fields.length - 1 > i ? section.fields[i + 1] : null;

      if (nextField && nextField.noWrap) {
        fields.push(
          <React.Fragment key={field.key}>
            <TwoColumns layout="EVEN" responsive>
              {renderField(schema, field, formikProps, {
                isEditMode: isEdit,
              })}
              {renderField(schema, nextField, formikProps, {
                isEditMode: isEdit,
              })}
            </TwoColumns>
          </React.Fragment>
        );
        i += 2;
      } else {
        // for TextField/PasswordField we want to show half width only
        if (field.type === 'text' || field.type === 'password') {
          const spacing = isFieldCollapsed(field, formikProps) ? 0 : 2;
          // if the field is collased, we should hide the padding
          fields.push(
            <React.Fragment key={field.key}>
              <TwoColumns layout="EVEN" responsive spacing={spacing}>
                {renderField(schema, field, formikProps, {
                  isEditMode: isEdit,
                })}
              </TwoColumns>
            </React.Fragment>
          );
        } else {
          fields.push(
            <React.Fragment key={field.key}>
              {renderField(schema, field, formikProps, {
                isEditMode: isEdit,
              })}
            </React.Fragment>
          );
        }

        i += 1;
      }
    }
    return fields;
  };

  return (
    <StyledDiv>
      {sections.map((section, index) => (
        <React.Fragment key={`${section.title || index}`}>
          {isSectionEnabled(section) && (
            <>
              <StyledForm>
                <div className="field-container">
                  {section.title && (
                    <div className="title-wrapper">
                      <Typography variant="h4">{section.title}</Typography>
                      <VerticalSpacer size={24} />
                    </div>
                  )}
                  {renderFields(section)}
                </div>
              </StyledForm>
              <VerticalSpacer size={24} />
            </>
          )}
        </React.Fragment>
      ))}
    </StyledDiv>
  );
};
