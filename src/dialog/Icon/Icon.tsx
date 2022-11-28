import React from 'react';
import {Icon as CommonIcon, IconProps} from '@gravity-ui/uikit';

export {default as closeIcon} from '../../../assets/icons/close-icon.svg';
export {default as infoIcon} from '../../../assets/icons/info-icon.svg';
export {default as dangerIcon} from '../../../assets/icons/danger-icon.svg';
export {default as tooltipIcon} from '../../../assets/icons/tooltip-icon.svg';
export {default as warningIcon} from '../../../assets/icons/warning-icon.svg';
export {default as repeatIcon} from '../../../assets/icons/repeat-icon.svg';

interface Props {
    iconData: IconProps['data'];
    width: IconProps['width'];
    height: IconProps['height'];
}

export default function Icon({iconData, height, width}: Props) {
    return <CommonIcon data={iconData} height={height} width={width} />;
}

Icon.defaultProps = {
    height: 16,
    width: 16,
    viewBox: '0 0 16 16',
};
