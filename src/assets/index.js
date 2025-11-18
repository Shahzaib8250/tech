import CheckmarkIcon from './images/icons/svg/checkmark.svg';
import DropdownArrowIcon from './images/icons/svg/dropdown-arrow.svg';
import PhoneIcon from './images/icons/svg/phone.svg';
import UserIcon from './images/icons/svg/user.svg';
import MailIcon from './images/icons/svg/mail.svg';
import CameraIcon from './images/icons/svg/camera.svg';
import LogoImage from './images/logos/logo-img.png';
import HeroImage from './hero/image.png';

// Asset imports and exports
// This file provides easy access to all assets throughout the application

// Export all assets
export { CheckmarkIcon, DropdownArrowIcon, PhoneIcon, UserIcon, MailIcon, CameraIcon };
export { LogoImage };
export { HeroImage };

// Asset constants for commonly used paths
export const ASSET_PATHS = {
  ICONS: {
    CHECKMARK: CheckmarkIcon,
    DROPDOWN_ARROW: DropdownArrowIcon,
    PHONE: PhoneIcon,
    USER: UserIcon,
    MAIL: MailIcon,
    CAMERA: CameraIcon,
  },
  LOGOS: {
    LOGO_IMG: LogoImage,
  },
  HERO: {
    IMAGE: HeroImage,
  },
};

// Helper function to preload images
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

// Helper function to preload multiple images
export const preloadImages = (srcs) => {
  return Promise.all(srcs.map(preloadImage));
};
