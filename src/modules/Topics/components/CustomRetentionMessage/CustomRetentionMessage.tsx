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
    setTopicData({
      ...topicData,
      [`${kebabToDotSeparated(fieldName)}.unit`]: selection,
    });

    onToggle(false);
  };

  const handleTouchSpinPlus = (event) => {
    const { name } = event?.currentTarget;
    const fieldName = kebabToDotSeparated(name);
    setTopicData({
      ...topicData,
      [fieldName]: Number(topicData[fieldName]) + 1,
    });
  };

  const handleTouchSpinMinus = (event) => {
    const { name } = event?.currentTarget;
    const fieldName = kebabToDotSeparated(name);
    setTopicData({
      ...topicData,
      [fieldName]: Number(topicData[fieldName]) - 1,
    });
  };

  const onChangeTouchSpin = (event: React.FormEvent<HTMLInputElement>) => {
    const { name: fieldNmae, value } = event.currentTarget;
    const truncValue = Math.trunc(Number(value)).toString();
    const fieldName = kebabToDotSeparated(fieldNmae);
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
            onMinus={handleTouchSpinMinus}
            onPlus={handleTouchSpinPlus}
            value={Number(topicData[kebabToDotSeparated(name)])}
            onChange={onChangeTouchSpin}
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
