import '../sass/style.scss';

import { $, $$ } from './modules/bling';
import disableShoutButton from './modules/disableButton';
import bindDropdowns from './modules/dropdowns';
import ajaxFollow from './modules/follow';
import ajaxLike from './modules/likeshout';
import lightbox from './modules/lightbox';

$$('.shout-form').forEach(disableShoutButton);
bindDropdowns($$('.dropdown'));
$$('.follow-form').on('submit', ajaxFollow);
$$('.shout-card__likes').on('click', ajaxLike);
lightbox($('#shout-form-btn'), $('#shout-form-screen'));

// TODO Add Clipboard copy of shout url
