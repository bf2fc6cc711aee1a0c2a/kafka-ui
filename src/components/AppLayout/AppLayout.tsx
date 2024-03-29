import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  PageHeader,
  Brand,
  PageHeaderTools,
  Page,
} from '@patternfly/react-core';
import { CaretDownIcon } from '@patternfly/react-icons';
import avatarImg from '../../images/img_avatar.svg';
import brandImg from '../../images/brandImg.png';

export const AppLayout: React.FC = ({ children }) => {
  const { t } = useTranslation(['kafkaTemporaryFixMe']);

  const [isDropDownOpen, setIsDropDownOpen] = useState<boolean>(false);
  const handleUserDropDownSelect = () => {
    setIsDropDownOpen(!isDropDownOpen);
  };

  const handleUserDropDownToggle = () => {
    setIsDropDownOpen(!isDropDownOpen);
  };

  const userDropDownItems = [<DropdownItem key='logout'>Logout</DropdownItem>];
  const brandImgLogo = <Brand src={brandImg} alt={t('common.red_hat_logo')} />;

  const userDropDownToggle = (
    <DropdownToggle
      id='user-dropdown-toggle'
      onToggle={handleUserDropDownToggle}
      toggleIndicator={CaretDownIcon}
    >
      Ned Username
    </DropdownToggle>
  );

  const userDropDown = (
    <Dropdown
      onSelect={handleUserDropDownSelect}
      toggle={userDropDownToggle}
      isOpen={isDropDownOpen}
      isPlain
      dropdownItems={userDropDownItems}
    />
  );

  const avatar = (
    <React.Fragment>
      <Avatar src={avatarImg} className='app-masthead-avatar' alt='avatar' />
    </React.Fragment>
  );

  const HeaderTools = (
    <PageHeaderTools>
      {userDropDown}
      {avatar}
    </PageHeaderTools>
  );

  const AppMastHead = () => (
    <PageHeader
      logo={brandImgLogo}
      logoComponent='h1'
      headerTools={HeaderTools}
    />
  );

  return (
    <Page mainContainerId='scrollablePageMain' header={<AppMastHead />}>
      {children}
    </Page>
  );
};
