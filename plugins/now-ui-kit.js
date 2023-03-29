import Vue from 'vue'
import globalComponents from './globalComponents';
import lang from 'element-ui/lib/locale/lang/en';
import locale from 'element-ui/lib/locale';
import VueLazyload from 'vue-lazyload';
import VueChatScroll from "vue-chat-scroll";
// import ReadMore from 'vue-read-more';
import Vue2TouchEvents from "vue2-touch-events";
import Vuelidate from "vuelidate";
locale.use(lang);

export default () => {
  Vue.use(globalComponents);
    // Vue.use(ReadMore);
  Vue.use(Vue2TouchEvents);
  Vue.use(Vuelidate);
  Vue.use(VueChatScroll);

  Vue.use(VueLazyload, {
    observer: true,
    // optional
    observerOptions: {
      rootMargin: '0px',
      threshold: 0.1
    }
  });
}
