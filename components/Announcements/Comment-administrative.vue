<template>
  <div>
    <modal :show.sync="showModal" headerClasses="justify-content-center">
      <h4 slot="header" class="title title-up"></h4>
      <input
        type="text"
        v-model="title"
        placeholder="tytuł pliku"
        class="form-control form-control-alternative mb-3"
      />

      <input type="file" ref="file" v-on:change="handleFileUpload()" />
      <button @click="addFile(selectedId)" class="pull-right btn-choose btn">
        Dodaj plik
      </button>

      <template slot="footer"> </template>
    </modal>
    <div
      v-for="announcement in announcements"
      :key="announcement.id"
      :class="{ announcements: isActive }"
    >
      <h5 class="media-heading media-heading-announcements">
        {{ announcement.user_name }} {{ announcement.user_surname }}
        <small class="text-muted text-date"
          >&middot; {{ announcement.date }}</small
        >
      </h5>
      <div class="buttons-info">
        <button
          v-if="$store.state.user.role === 'admin'"
          @click="openModal(announcement.id)"
          class="btn-announcement pull-right btn-choose btn"
        >
          Dodaj plik
        </button>

        <button
          v-if="$store.state.user.role === 'admin'"
          type="button"
          class="btn-announcement btn-edit btn"
          @click="
            modalEditAnnouncement(
              announcement.id,
              announcement.title,
              announcement.description,
            )
          "
        >
          Edytuj
        </button>

        <button
          v-if="$store.state.user.role === 'admin'"
          type="button"
          class="btn-announcement btn pull-right"
          @click="confirmRemove(announcement.id, announcement.title)"
        >
          Usuń
        </button>
      </div>
      <div class="media-body media-announcements">
        <textarea
          v-if="$store.state.user.role === 'user'"
          readonly
          ref="infoBox"
          class="title-announcement text-announcement infoBox"
          v-model="announcement.title"
        >
        </textarea>
        <textarea
          readonly
          v-if="$store.state.user.role === 'admin'"
          ref="infoBox"
          class="title-announcement text-announcement infoBox"
          v-model="announcement.title"
          placeholder="tytuł ogłoszenia"
        >
        </textarea>
        <span class="pb-3"></span>
        <div id="more">
          <pre
            class="text-pre"
          ><div class="text-announcement infoBox " ref="infoBox" v-html="URLify(announcement.description)"></div></pre>
        
          <div class="media-footer media-actions">
            <div v-if="announcement.files.length" class="text-download-files">
              Pliki do pobrania:
            </div>
            <div
              v-for="(file, index) in announcement.files"
              class="text-file d-flex"
              :key="index"
            >
              <el-tooltip content="Pobierz plik" placement="top">
                <a
                  class="d-flex"
                  :href="`${$api.defaults.baseURL}/docs/${file.file_name}`"
                  target="_blank"
                >
                  <div v-if="file.file_title">{{ file.file_title }}</div>
                  <div v-else>{{ file.file_original_name }}</div>
                  <button type="button" class="btn-download">
                    <i
                      class="now-ui-icons arrows-1_cloud-download-93 btn-download"
                    ></i>
                  </button>
                </a>
              </el-tooltip>
              <el-tooltip
                v-if="$store.state.user.role === 'admin'"
                content="Usuń plik"
                placement="top"
              >
                <button
                  type="button"
                  class="btn-remove"
                  @click="removeFile(file.file_id, announcement.id)"
                >
                  <i class="now-ui-icons ui-1_simple-remove"></i>
                </button>
              </el-tooltip>
            </div>
          </div>
        </div>
      </div>
      <button
        @click="moreOrLess($event)"
        id="myBtn"
        class="border-none btn-more-less readmore-txt badge badge-success badge-pill badge-black cursor-pointer float-right"
      >
        więcej
      </button>
    </div>
    <modal
      :show.sync="showModalConfirmation"
      headerClasses="justify-content-center"
    >
      <h4 slot="header" class="">
        Czy na pewno chcesz usunąć ogłoszenie "{{ announcementTitle }}" ?
      </h4>
      <div class="d-flex justify-content-end">
        <button
          class="btn btn-announcement"
          @click="showModalConfirmation = false"
        >
          Zamknij
        </button>
        <button
          class="btn btn-success btn-announcement"
          @click="removeAnnouncement(removeId)"
        >
          Usuń
        </button>
      </div>
    </modal>

    <modal :show.sync="showEditModal" headerClasses="justify-content-center">
      <h4 slot="header" class="title title-up"></h4>

      <input
        type="text"
        v-model="announcementTitle"
        class="form-control mb-4"
        placeholder="Tytuł ogłoszenia"
      />
      <textarea
        class="form-control form-info m-0"
        placeholder="Opis ogłoszenia"
        rows="6"
        v-model="announcementDescription"
      >
      </textarea>
      <div
        v-if="
          announcementTitle.length === 0 || announcementDescription.length === 0
        "
        class="text-error"
      >
        Tytuł i opis ogłoszenia jest wymagany.
      </div>
      <div class="media-footer">
        <button
          type="success"
          class="pull-right btn-announcement btn-save btn-succes btn"
          :disabled="isDisabled"
          @click="
            editAnnouncement(
              announcementId,
              announcementTitle,
              announcementDescription,
            )
          "
        >
          Zapisz
        </button>
      </div>
    </modal>
  </div>
</template>
<script>
import { Tooltip } from "element-ui";
import { Modal } from "@/components";
import { URLify } from "../../utils/URLify";

export default {
  name: "comment",
  components: {
    [Tooltip.name]: Tooltip,
    Modal,
  },
  props: {
    announcements: {
      type: Array,
      default: [],
    },
  },
  mounted() {
    setTimeout(() => {
      this.textareaHeight();
    }, 600);
  },
  data() {
    return {
      isDisabled: false,
      showEditModal: false,
      announcementId: null,
      announcementTitle: "",
      announcementDescription: "",
      showModalConfirmation: false,
      removeId: null,
      showModal: false,
      selectedId: null,
      isActive: true,
      description: "",
      errorFile: "",
      title: "",
    };
  },

  methods: {
    URLify,
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
      this.$nextTick(function () {
        if (this.$refs.infoBox !== undefined) {
          this.$refs.infoBox.forEach((area) => {
            area.setAttribute(
              "style",
              "height:" + area.scrollHeight + "px;overflow-y:hidden;",
            );
          });
        }
      });
    },
    modalEditAnnouncement(id, title, description) {
      setTimeout(() => {
        this.textareaHeight();
      }, 500);
      this.showEditModal = true;
      this.announcementId = id;
      this.announcementTitle = title;
      this.announcementDescription = description;
    },
    openModal(id) {
      this.selectedId = id;
      this.showModal = true;
    },
    async addFile(id) {
      if (!this.file) {
        this.$toast.error("Nie dodano pliku");
      } else {
        let formData = new FormData();
        formData.append("file", this.file);
        formData.append("title", this.title);

        try {
          const response = await this.$api.post(
            "file/upload/announcement/" + id,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            },
          );
          this.$toast.success("Dodano plik");
          this.showModal = false;
          this.$refs.file.value = null;
          this.loadAnnouncements();
          this.title = "";
          this.file = "";
        } catch {
          this.$toast.error(
            "Nie dodano. Wymagany format pliku: csv, txt, xlx, xls, xlsx, pdf, doc, docx, rtf",
          );
        }
      }
    },
    confirmRemove(id, title) {
      this.announcementTitle = title;
      this.removeId = id;
      this.showModalConfirmation = true;
    },
    async removeFile(id, announcementId) {
      await this.$api.delete("/file/delete/announcement/" + id);
      const index = this.announcements.findIndex(
        (index) => index.id === announcementId,
      );
      const index2 = this.announcements[index].files.findIndex(
        (index2) => index2.file_id === id,
      );
      if (index2 !== -1) {
        this.announcements[index].files.splice(index2, 1);
      }
    },

    async editAnnouncement(id, announcementTitle, announcementDescription) {
      let formData = new FormData();

      if (announcementDescription.length && announcementTitle.length) {
        this.isDisabled = true;
        formData.append("title", announcementTitle);
        formData.append("description", announcementDescription);
        try {
          const response = await this.$api.post(
            "announcements/edit/" + id,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            },
          );
          this.$toast.success("Ogłoszenie edytowano");
          this.textareaHeight();
          this.showEditModal = false;
          this.isDisabled = false;
          this.loadAnnouncements();
        } catch {
          this.$toast.error("Error. Spróbuj ponownie.");
          this.isDisabled = false;
        }
      }
    },

    async removeAnnouncement(id) {
      try {
        await this.$api.delete("announcements/delete/" + id);
        const index = this.announcements.findIndex((index) => index.id === id);
        if (index !== -1) {
          this.announcements.splice(index, 1);
          this.showModalConfirmation = false;
          this.$toast.success("Ogłoszenie usunięto");
        }
        this.loadAnnouncements();
      } catch {
        this.$toast.error("Error");
      }
    },
    handleFileUpload() {
      this.file = this.$refs.file.files[0];
    },
    async loadAnnouncements() {
      this.textareaHeight();

      const response = await this.$api.get("/announcements/get/administrative");
      this.announcements = response.data.data;
      this.currentPage = response.data.current_page;
      this.total = response.data.total;
      this.perPage = response.data.perPage;
    },

    moreOrLess(event) {
      if (
        event.target.previousElementSibling.lastChild.previousElementSibling
          .style.display === "none"
      ) {
        event.target.previousElementSibling.lastChild.previousElementSibling.style.display =
          "inline";
        event.target.innerHTML = "więcej";
        event.target.previousElementSibling.lastChild.style.display = "none";
      } else {
        event.target.previousElementSibling.lastChild.previousElementSibling.style.display =
          "none";
        event.target.innerHTML = "mniej";
        event.target.previousElementSibling.lastChild.style.display = "inline";
        this.textareaHeight();
      }
    },
  },
};
</script>
<style scoped>
a {
  color: black;
}
.announcements {
  border-bottom: 1px solid grey;
  padding-bottom: 20px;
}
.toggledText {
  height: 30px;
  overflow: hidden;
}

.toggledText.toggle {
  height: auto;
}

.readless-txt,
.toggledText.toggle ~ #readmore button.readmore-txt {
  display: none;
}

.toggledText.toggle ~ #readmore button.readless-txt {
  display: block;
}
.border-none {
  border: none;
}
#myBtn {
  outline: none;
}
#more {
  display: none;
}
</style>
