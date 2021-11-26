import React from 'react';
import {
  Flex,
  FlexItem,
  Select,
  SelectProps,
  SelectOption,
  NumberInput,
  NumberInputProps,
  SelectVariant,
  SelectOptionObject,
} from '@patternfly/react-core';
import {
  IAdvancedTopic,
  kebabToDotSeparated,
  SelectOptions,
  RetentionTimeUnits,
} from '@app/modules/Topics/utils';

export type CustomRetentionMessageProps = NumberInputProps &
  SelectProps & {
    id?: string;
    selectOptions: SelectOptions[];
    topicData: IAdvancedTopic;
    name: string;
    setTopicData: (data: IAdvancedTopic) => void;
  };

const CustomRetentionMessage: React.FC<CustomRetentionMessageProps> = ({
  onToggle,
  isOpen,
  selectOptions,
  topicData,
  setTopicData,
  name,
}) => {
  const onSelectRetentionUnit = (
    fieldName: string,
    selection: string | SelectOptionObject
  ) => {
    let propetyName;
    if (fieldName === 'retention-ms') {
      propetyName = 'selectedRetentionTimeOption';
    } else if (fieldName === 'retention-bytes') {
      propetyName = 'selectedRetentionSizeOption';
    }

    setTopicData({
      ...topicData,
      [`${kebabToDotSeparated(fieldName)}.unit`]: selection,
      [propetyName]:
        selection !== RetentionTimeUnits.DAY
          ? RetentionTimeUnits.CUSTOM
          : topicData.selectedRetentionTimeOption,
    });

    onToggle(false);
  };

  const handleTouchSpin = (name: string, operator: string) => {
    let value;
    const fieldName = kebabToDotSeparated(name);
    const selectedRetention =
      fieldName === 'retention.ms'
        ? 'selectedRetentionTimeOption'
        : 'selectedRetentionSizeOption';

    if (operator === '+') {
      value = Number(topicData[fieldName]) + 1;
    } else if (operator === '-') {
      value = Number(topicData[fieldName]) - 1;
    }

    setTopicData({
      ...topicData,
      [fieldName]: value,
      [selectedRetention]: RetentionTimeUnits.CUSTOM,
    });
  };

  const onChangeTouchSpin = (
    event: React.FormEvent<HTMLInputElement>,
    name: string
  ) => {
    const { value } = event.currentTarget;
    const truncValue = Math.trunc(Number(value)).toString();
    const fieldName = kebabToDotSeparated(name);

    setTopicData({
      ...topicData,
      [fieldName]: truncValue,
    });
  };

  return (
    <div className='kafka-ui--radio__parameters'>
      <Flex>
        <FlexItem>
          <NumberInput
            name={name}
            onMinus={() => handleTouchSpin(name, '-')}
            onPlus={() => handleTouchSpin(name, '+')}
            value={Number(topicData[kebabToDotSeparated(name)])}
            onChange={(event) => onChangeTouchSpin(event, name)}
            plusBtnProps={{ name }}
            minusBtnProps={{ name }}
            min={0}
          />
        </FlexItem>
        <FlexItem>
          <Select
            variant={SelectVariant.single}
            aria-label='Select Input'
            onToggle={onToggle}
            onSelect={(_, selection) => onSelectRetentionUnit(name, selection)}
            selections={topicData[`${kebabToDotSeparated(name)}.unit`]}
            isOpen={isOpen}
          >
            {selectOptions?.map((s) => (
              <SelectOption
                key={s.key}
                value={s.value}
                isPlaceholder={s.isPlaceholder}
              />
            ))}
          </Select>
        </FlexItem>
      </Flex>
    </div>
  );
};

export { CustomRetentionMessage };
