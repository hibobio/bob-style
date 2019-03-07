export enum AvatarSize {
  mini = 'mini',
  small = 'small',
  medium  = 'medium',
  large  = 'large',
}

export namespace AvatarSizeConverter {
  export function toNumber(avatarSize: AvatarSize): number {
    switch (avatarSize) {
      case AvatarSize.mini:
        return 30;
      case AvatarSize.small:
        return 60;
      case AvatarSize.medium:
        return 90;
      case AvatarSize.large:
        return 120;
    }
  }
}
