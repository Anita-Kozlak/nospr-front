<template>
  <div class="page-header">
    <div id="div_background">
      <div style="background-image: url('img/background_image.jpg')"></div>
    </div>
    <div class="buttons">
      <NuxtLink to="/" class="navbar btn-mainview"> Strona główna </NuxtLink>
      <sign-out></sign-out>
    </div>
    <div id="contentAreas" class="cd-section">
      <div id="tables">
        <div id="comments" class="">
          <div class="row section-comments">
            <div class="col-md-8 ml-auto mr-auto section-comments section-chat">
              <div
                class="media-area media-chat media-scroll"
                v-chat-scroll
                id="media-scroll"
              >
                <comment
                  v-for="message in messages"
                  :id="message.id"
                  :key="message.id"
                  :name="message.user_name"
                  :surname="message.user_surname"
                  :date="message.date"
                  :comment="message.message"
                  :replies="message.replies"
                >
                </comment>
              </div>
              <div class="media media-post">
                <!-- <div class="loader loader-chat" v-if="loading">Loading...</div> -->

                <div class="media-body media-send">
                  <textarea
                    @click="writeMessage()"
                    class="form-chat"
                    placeholder="Napisz wiadomość..."
                    rows="6"
                    v-model="comment"
                  >
                  </textarea>
                  <button
                    class="btn-send"
                    @click="addMessage()"
                    :disabled="isDisabled"
                  >
                    <i class="now-ui-icons ui-1_send"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  Card,
  Button,
  Checkbox,
  Comment,
  FormGroupInput,
  Pagination,
} from "@/components";
import { Table, TableColumn, Tooltip } from "element-ui";
import VueChatScroll from "vue-chat-scroll";
import SignOut from "../components/SignOut";

export default {
  components: {
    Card,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Tooltip.name]: Tooltip,
    [Checkbox.name]: Checkbox,
    [Button.name]: Button,
    [FormGroupInput.name]: FormGroupInput,
    [Pagination.name]: Pagination,
    Comment,
    VueChatScroll,
    SignOut,
  },

  mounted() {
    this.loadedChat();
    this.counterInterval = setInterval(() => {
      this.loadedChat();
    }, 4000);
  },

  beforeRouteLeave(to, from, next) {
    clearInterval(this.counterInterval);
    next();
  },
  data() {
    return {
      messages: [],
      comment: "",
      isDisabled: false,
      loading: true,
      counterInterval: "",
    };
  },

  methods: {
    async addMessage() {
      if (this.comment.length > 1) {
        try {
          this.isDisabled = true;
          await this.$api.post("/messages/send", {
            message: this.comment,
          });
        } catch (e) {
          console.log(e);
        }
        this.comment = "";
        this.isDisabled = false;
        await this.loadedChat();
      } else {
        this.isDisabled = false;
      }
    },

    async loadedChat() {
      const response = await this.$api.get("/messages");
      this.messages = response.data.data.reverse();
      this.loading = false;
    },

    writeMessage() {
      setTimeout(() => {
        let messageBody = document.getElementById("media-scroll");
        messageBody.scrollTop = messageBody.scrollHeight;
      }, 250);
    },
  },
};
</script>
<style>
.checkbox-cell {
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>