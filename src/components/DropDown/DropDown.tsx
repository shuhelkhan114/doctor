import Checkbox from 'expo-checkbox';
import { useEffect, useState } from 'react';

import Modal from '@components/Modal/Modal';
import ScrollView from '@components/ScrollView/ScrollView';
import Search from '@components/Search/Search';
import useAppTheme from '@hooks/useTheme';
import Block, { BlockProps } from '../Block/Block';
import Icon from '../Icon/Icon';
import Typography from '../Typography/Typography';

export interface DropDownOption {
  label: string;
  value: string;
}

export interface DropDownProps extends BlockProps {
  value?: string;
  multiple?: boolean;
  placeholder?: string;
  options: DropDownOption[];
  type?: 'default' | 'modal';
  modalTitle?: string;
  searchable?: boolean;
  minDropdownHeight?: string;
  floatingLabel?: boolean;
  renderTitle?: (props: { closeModal: () => void }) => React.ReactNode;
  renderField?: (props: { openModal: () => void }) => React.ReactNode;
  onSelect?: (value: string) => void;
}

const DropDown: React.FC<DropDownProps> = (props) => {
  const {
    value,
    minDropdownHeight,
    placeholder = '',
    floatingLabel = true,
    modalTitle = 'Select an option',
    options = [],
    style,
    multiple,
    searchable,
    renderTitle,
    renderField,
    onSelect,
    ...restProps
  } = props;

  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<DropDownOption[]>(() => options);

  useEffect(() => {
    if (search === '') {
      setFilteredOptions(options);
    } else {
      setFilteredOptions(
        options.filter((option) => option.label.toLowerCase().includes(search.toLowerCase()))
      );
    }
  }, [search]);

  const theme = useAppTheme();

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const optionsMap: {
    [key: string]: string;
  } = options.reduce((acc, option) => {
    // @ts-ignore
    acc[option.value] = option.label;
    return acc;
  }, {});

  return (
    <Block>
      <Modal
        disabledSwipe
        onClose={setModalVisible}
        visible={modalVisible}
        minHeight={minDropdownHeight}>
        {renderTitle ? (
          renderTitle({ closeModal })
        ) : (
          <Typography variation="title3Bolder">{modalTitle}</Typography>
        )}

        <Block>
          {searchable && (
            <Search placeholder="Search health issues" onSearch={setSearch} onClear={setSearch} />
          )}

          <Block mB="xl" />

          <ScrollView>
            {filteredOptions.map((option) => {
              const handleSelect = () => {
                if (multiple) {
                  const alreadyExits = value?.split(',').includes(option.value);
                  if (alreadyExits) {
                    onSelect?.(
                      // @ts-ignore
                      value
                        ?.split(',')
                        .filter((v) => v !== option.value)
                        .join(',')
                    );
                  } else {
                    if (options.length - 1 === value?.split(',').length) {
                      onSelect?.('*');
                    } else {
                      if (value === '') {
                        onSelect?.(option.value);
                      } else {
                        onSelect?.(value + `,${option.value}`);
                      }
                    }
                  }
                } else {
                  onSelect?.(option.value);
                  setModalVisible(false);
                }
              };

              const checked = value === '*' || value?.split(',').includes(option.value);

              return (
                <Block
                  pV="xl"
                  key={option.value}
                  flexDirection="row"
                  align="center"
                  justify="space-between"
                  onPress={handleSelect}>
                  <Typography variation="title3" flex1>
                    {option.label}
                  </Typography>
                  {multiple && <Checkbox value={checked} onValueChange={handleSelect} />}
                </Block>
              );
            })}
          </ScrollView>
        </Block>
      </Modal>

      {renderField ? (
        renderField({ openModal })
      ) : (
        <Block
          bW={1}
          pV="xl"
          pH="4xl"
          rounded="6xl"
          align="center"
          flexDirection="row"
          justify="space-between"
          bC={value ? 'accent' : 'light'}
          onPress={() => setModalVisible(true)}
          {...restProps}>
          {value && floatingLabel && (
            <Block
              pH="sm"
              absolute
              top={-7}
              left={24}
              rounded="xs"
              style={{ backgroundColor: theme.colors.white + 'D0' }}>
              <Typography variation="description2" color="dark" style={{ fontSize: 12 }}>
                {placeholder}
              </Typography>
            </Block>
          )}
          <Typography color="dark" numberOfLines={1} variation="description2" flex1>
            {value === '*'
              ? 'All of them'
              : value
              ? value
                  .split(',')
                  .map((value) => optionsMap[value])
                  .join(', ')
              : placeholder}
          </Typography>
          <Icon size={24} name="chevron-down" color={theme.colors.secondaryBlue} />
        </Block>
      )}
    </Block>
  );
};

export default DropDown;
