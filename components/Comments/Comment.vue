<template>
  <div class="media media-chat">
    <div
      class="media-right media-body"
      v-if="
        name + ' ' + surname ===
        $store.state.user.name + ' ' + $store.state.user.surname
      "
    >
      <h5>
        <slot name="author"> {{ name }} {{ surname }} </slot>
        <slot name="date">
          <small class="text-muted">&middot; {{ date }}</small>
        </slot>
      </h5>
      <div class="media-color__right">
        <slot name="comment">
          <!-- <a
            v-if="comment.match( /(?:www|https?)[^\s]+/g )"
            class="text-chat text-black"
            :href="comment"
            target="_blank"
            >{{ comment }}</a
          > -->
          <div class="text-chat text-black" v-html="URLify(comment)"></div>
          <!-- <span v-else class="text-chat" v-html="comment"></span> -->
        </slot>

        <div class="media-footer">
          <slot name="actions"> </slot>
        </div>
        <!-- <div>
                <slot name="replies">
                    <comment v-for="comment in replies"
                             :key="comment.author"
                             :author="comment.author"
                             :avatar="comment.avatar"
                             :date="comment.date"
                             :comment="comment.comment"
                             :replies="comment.replies"
                    >
                        <template slot="actions">
                            <el-tooltip content="Odpowiedz" placement="top">
                                <a class="btn btn-success btn-neutral pull-right">
                                    <i class="now-ui-icons ui-1_send"></i>
                                </a>
                            </el-tooltip>
                            <a :class="{'btn-default': !comment.liked}"
                               class="btn btn-neutral pull-right">
                                <i class="now-ui-icons ui-2_favourite-28"></i>
                                {{comment.likes}}
                            </a>
                        </template>

                    </comment>
                </slot> -->
        <!-- </div> -->
      </div>
    </div>
    <div
      class="media-left media-body"
      v-if="
        name + ' ' + surname !==
        $store.state.user.name + ' ' + $store.state.user.surname
      "
    >
      <h5>
        <slot name="author"> {{ name }} {{ surname }} </slot>
        <slot name="date">
          <small class="text-muted">&middot; {{ date }}</small>
        </slot>
      </h5>
      <div class="media-color__left">
        <slot name="comment" class="media-color">
          <!-- <a
            v-if="comment.match( /(?:www|https?)[^\s]+/g )"
            class="text-chat text-black"
            :href="comment"
            target="_blank"
            >{{ comment }}</a
          > -->
          <div class="text-chat text-black" v-html="URLify(comment)"></div>

          <!-- <span v-else class="text-chat" v-html="comment"></span> -->
        </slot>

        <div class="media-footer">
          <slot name="actions"> </slot>
        </div>
        <!-- <div>
                <slot name="replies">
                    <comment v-for="comment in replies"
                             :key="comment.author"
                             :author="comment.author"
                             :avatar="comment.avatar"
                             :date="comment.date"
                             :comment="comment.comment"
                             :replies="comment.replies"
                    >
                        <template slot="actions">
                            <el-tooltip content="Odpowiedz" placement="top">
                                <a class="btn btn-success btn-neutral pull-right">
                                    <i class="now-ui-icons ui-1_send"></i>
                                </a>
                            </el-tooltip>
                            <a :class="{'btn-default': !comment.liked}"
                               class="btn btn-neutral pull-right">
                                <i class="now-ui-icons ui-2_favourite-28"></i>
                                {{comment.likes}}
                            </a>
                        </template>

                    </comment>
                </slot>
            </div> -->
      </div>
    </div>
  </div>
</template>
<script>
import { Tooltip } from "element-ui";
export default {
  name: "comment",
  components: {
    [Tooltip.name]: Tooltip,
  },
  props: {
    id: {
      type: [String, Number],
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
    surname: {
      type: String,
      default: "",
    },
    date: {
      type: String,
      default: "",
    },
    comment: {
      type: String,
      default: "",
    },
    replies: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    URLify(string) {
      const urls = string.match(
        /((((ftp|https?):\/\/)|(w{3}\.))[\-\w@:%_\+.~#?,&\/\/=]+)/g,
      );
      if (urls) {
        urls.forEach(function (url) {
          string = string.replace(
            url,
            '<a class="chat link-decorator link-dark text-black" target="_blank" href="' +
              url +
              '">' +
              url +
              "</a>",
          );
        });
      }
      return string.replace("(", "<br/>(");
    },
  },
};
</script>
<style>
a {
  text-decoration: underline;
  color: blue;
}
a:hover {
  text-decoration: underline;
  color: blue;
}
a:visited {
  color: black;
}
.text-black {
  color: #000;
}
</style>
