import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  PageHeader,
  Brand,
  PageHeaderTools,
} from '@patternfly/react-core';
import React, { useState } from 'react';
import { CaretDownIcon } from '@patternfly/react-icons';
import avatarImg from '../../Images/img_avatar.svg';
import brandImg from '../../Images/brandImg.png';
import { useTranslation } from 'react-i18next';

export const AppMastHead: React.FC = () => {
  const { t } = useTranslation();

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

  return (
    <PageHeader
      logo={brandImgLogo}
      logoComponent='h1'
      headerTools={HeaderTools}
    />
  );
};
