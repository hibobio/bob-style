import { URLtype } from './url.enum';

export const allowedDomainsTest = {
  [URLtype.youtube]: /(www\.)?youtu(be\.com|\.be|be\.googleapis\.com)/i,
  [URLtype.vimeo]: /(player\.|www\.)?(vimeo\.com)/i,
};

export const naiveLinkTest = /(www\.|http|\/|\w+\.\w+)/i;

export const imageLinkTest = /(\.(jpg|jpeg|gif|png|svg|webp))|(data:image)/i;

export const filestackTest = /(filestackcontent.com)/i;

export const base64imageTest = /^data:image\/(jpg|jpeg|gif|png|svg|webp);base64,/i;
