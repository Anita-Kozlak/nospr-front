<template>
  <div class="page-announcements page-header">
    <div id="div_background">
      <div style="background-image: url('img/background_image.jpg')"></div>
    </div>
    <div class="buttons">
      <NuxtLink to="/" class="navbar btn-mainview"> Strona główna </NuxtLink>
      <sign-out></sign-out>
    </div>
    <div class="section-announcements">
      <div id="contentAreas" class="cd-section">
        <div id="comments">
          <div class="row">
            <div
              class="col-md-8 ml-auto mr-auto section-info"
              id="media-scroll"
            >
              <NuxtLink to="/announcements">
                <img v-lazy="'img/back-arrow.png'" alt="" class="image-back" />
              </NuxtLink>
              <h3 class="heading">Ogłoszenia Artystyczne</h3>
              <div class="loader" v-if="loading">Loading...</div>
              <div
                v-if="$store.state.user.role === 'admin'"
                @click="openModal()"
                type="success"
                class="pull-left btn btn-add-announcement"
              >
                Dodaj ogłoszenie
              </div>
              <h4 class="section-title" v-if="!announcements.length">
                Brak ogłoszeń
              </h4>

              <div class="media-area">
                <comment
                  :announcements="announcements"
                  :loadAnnouncents="loadAnnouncements"
                />
                <n-pagination
                  v-if="announcements.length"
                  :pageCount="pageCount"
                  :perPage="perPage"
                  :total="total"
                  type="success"
                  class="justify-content-center"
                  v-model="currentPage"
                  @input="pageChange"
                >
                </n-pagination>
              </div>

              <modal
                :show.sync="showModal"
                headerClasses="justify-content-center"
              >
                <h4 slot="header" class="title title-up"></h4>

                <input
                  type="text"
                  v-model="title"
                  class="form-control"
                  placeholder="Tytuł ogłoszenia"
                  @input="validateTitle"
                />
                <div class="text-error">{{ errorTitle }}</div>
                <textarea
                  class="form-control form-info m-0"
                  @input="validateDescription"
                  placeholder="Opis ogłoszenia"
                  rows="6"
                  v-model="description"
                >
                </textarea>
                <div class="text-error">{{ errorDescription }}</div>
                <input
                  type="text"
                  v-model="file_title"
                  placeholder="Tytuł pliku"
                  class="form-control form-control-alternative mb-3"
                />
                <input
                  class="pull-left"
                  type="file"
                  multiple
                  ref="files"
                  v-on:change="handleFilesUpload()"
                />
                <div class="media-footer">
                  <button
                    type="success"
                    class="pull-right btn"
                    :disabled="isDisabled"
                    @click="addAnnouncement()"
                  >
                    Dodaj
                  </button>
                </div>
                <div
                  v-if="this.$store.state.user.role === 'admin'"
                  class="notification-checkbox allTeams"
                >
                  <input type="checkbox" v-model="notify_all" /><label
                    class="notification"
                    >Wyślij ogłoszenie do wszystkich zespołów NFM</label
                  >
                </div>
              </modal>
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
  FormGroupInput,
  Pagination,
  Modal,
} from "@/components";
import Comment from "../components/Announcements/Comment-artistic";
import { Table, TableColumn, Tooltip } from "element-ui";
import SignOut from "../components/SignOut.vue";

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
    Modal,
    SignOut,
  },
  mounted() {
    this.textareaHeight();
    this.loadAnnouncements();
  },
  data() {
    const today = new Date();
    return {
      pageCount: 0,
      perPage: 0,
      total: 0,
      value: 0,
      currentPage: 1,
      is_artistic: 1,
      notify_all: 0,
      teams: [],
      errorTitle: "",
      errorDescription: "",
      file: "",
      files: [],
      description: "",
      announcements: [],
      today: today.toLocaleDateString(),
      showModal: false,
      isActive: false,
      isDisabled: false,
      loading: false,
      file_title: "",
      title: "",
    };
  },

  methods: {
    textareaHeight() {
      const tx = document.getElementsByTagName("textarea");
      for (let i = 0; i < tx.length; i++) {
        tx[i].setAttribute(
          "style",
          "height:" + tx[i].scrollHeight + "px;overflow-y:hidden;",
        );
        tx[i].addEventListener("input", OnInput, false);
      }

      function OnInput() {
        this.style.height = "auto";
        this.style.height = this.scrollHeight + "px";
      }
    },
    openModal() {
      this.showModal = true;
    },
    validateTitle() {
      if (!this.title) {
        this.$set(this, "errorTitle", "To pole jest obowiązkowe.");
      } else {
        this.$set(this, "errorTitle", "");
      }
    },
    validateDescription() {
      if (!this.description) {
        this.$set(this, "errorDescription", "To pole jest obowiązkowe.");
      } else {
        this.$set(this, "errorDescription", "");
      }
    },
    async pageChange(value) {
      const response = await this.$api.get(
        "announcements/get/artistic?page=" + value,
      );
      this.announcements = response.data.data;
      let messageBody = document.getElementById("media-scroll");
      messageBody.scrollTo(0, 0);
    },

    async addAnnouncement() {
      // this.isActive = true;
      this.validateTitle();
      this.validateDescription();
      if (!this.errorTitle && !this.errorDescription) {
        let formData = new FormData();
        this.isDisabled = true;
        for (var i = 0; i < this.files.length; i++) {
          let file = this.files[i];
          formData.append("files[" + i + "]", file);
        }
        formData.append("title", this.title);
        formData.append("description", this.description);
        formData.append("is_artistic", this.is_artistic);
        formData.append("file_title", this.file_title);
        formData.append("notify_all", this.notify_all ? 1 : 0);
        try {
          await this.$api.post("/announcements/create", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          this.$toast.success("Dodano ogłoszenie");
          this.title = "";
          this.description = "";
          this.file_title = "";
          this.$refs.files.value = null;
          this.isDisabled = false;
          await this.loadAnnouncements();
          this.showModal = false;
        } catch {
          this.$toast.error("Error");
          this.isDisabled = false;
        }
      }
    },

    handleFilesUpload() {
      this.files = this.$refs.files.files;
    },

    async loadAnnouncements() {
      this.isActive = false;
      this.loading = true;
      const response = await this.$api.get("announcements/get/artistic");
      this.loading = false;
      this.announcements = response.data.data;
      this.currentPage = response.data.current_page;
      this.total = response.data.total;
      this.pageCount = response.data.last_page;
      this.perPage = response.data.perPage;
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
