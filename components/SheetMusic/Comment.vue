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
      v-for="material in materials"
      :key="material.id"
      :class="{ announcements: isActive }"
    >
      <h5 class="media-heading media-heading-announcements">
        {{ material.user_name }} {{ material.user_surname }}
        <small class="text-muted text-date">&middot; {{ material.date }}</small>
      </h5>
      <div class="buttons-info">
        <button
          v-if="$store.state.user.role === 'admin'"
          @click="openModal(material.id)"
          class="btn-announcement pull-right btn-choose btn"
        >
          Dodaj plik
        </button>

        <button
          v-if="$store.state.user.role === 'admin'"
          type="button"
          class="btn-announcement btn-edit btn"
          @click="
            modalEditMaterial(material.id, material.title, material.description)
          "
        >
          Edytuj
        </button>

        <button
          v-if="$store.state.user.role === 'admin'"
          type="button"
          class="btn-announcement btn pull-right"
          @click="confirmRemove(material.id, material.title)"
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
          v-model="material.title"
        >
        </textarea>
        <textarea
          readonly
          v-if="$store.state.user.role === 'admin'"
          ref="infoBox"
          class="title-announcement text-announcement infoBox"
          v-model="material.title"
          placeholder="tytuł ogłoszenia"
        >
        </textarea>
        <span class="pb-3"></span>
        <div id="more">
          <pre
            v-if="$store.state.user.role === 'user'"
            class="text-pre"
          ><div  readonly class="text-announcement infoBox " ref="infoBox" v-html="URLify(material.description)"></div></pre>
          <pre
            class="text-pre"
            v-if="$store.state.user.role === 'admin'"
          ><textarea readonly  class="text-announcement infoBox" ref="infoBox" v-model="material.description" placeholder="opis ogłoszenia"></textarea></pre>
          <div class="media-footer media-actions">
            <div v-if="material.files.length" class="text-download-files">
              Pliki do pobrania:
            </div>
            <div
              v-for="(file, index) in material.files"
              class="text-file d-flex"
              :key="index"
            >
              <el-tooltip content="Pobierz plik" placement="top">
                <a
                  style="word-break: break-all; font-size: 11px;"
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
                  @click="removeFile(file.file_id, material.id)"
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
        Czy na pewno chcesz usunąć ogłoszenie "{{ materialTitle }}" ?
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
          @click="removeMaterial(removeId)"
        >
          Usuń
        </button>
      </div>
    </modal>

    <modal :show.sync="showEditModal" headerClasses="justify-content-center">
      <h4 slot="header" class="title title-up"></h4>

      <input
        type="text"
        v-model="materialTitle"
        class="form-control mb-4"
        placeholder="Tytuł ogłoszenia"
      />
      <textarea
        class="form-control form-info m-0"
        placeholder="Opis ogłoszenia"
        rows="6"
        v-model="materialDecription"
      >
      </textarea>
      <div
        v-if="materialTitle.length === 0 || materialDecription.length === 0"
        class="text-error"
      >
        Tytuł i opis ogłoszenia jest wymagany.
      </div>
      <div class="media-footer">
        <button
          type="success"
          class="pull-right btn-announcement btn-save btn-succes btn"
          :disabled="isDisabled"
          @click="editMaterial(materialId, materialTitle, materialDecription)"
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
    materials: {
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
      materialId: null,
      materialTitle: "",
      materialDecription: "",
      showModalConfirmation: false,
      removeId: null,
      showModal: false,
      selectedId: null,
      isActive: true,
      description: "",
      height: 0,
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
    modalEditMaterial(id, title, description) {
      setTimeout(() => {
        this.textareaHeight();
      }, 500);
      this.showEditModal = true;
      this.materialId = id;
      this.materialTitle = title;
      this.materialDecription = description;
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
            "file/upload/material/" + id,
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
          this.loadMaterials();
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
      this.materialTitle = title;
      this.removeId = id;
      this.showModalConfirmation = true;
    },
    async removeFile(id, materialId) {
      await this.$api.delete("/file/delete/material/" + id);
      const index = this.materials.findIndex(
        (index) => index.id === materialId,
      );
      const index2 = this.materials[index].files.findIndex(
        (index2) => index2.file_id === id,
      );
      if (index2 !== -1) {
        this.materials[index].files.splice(index2, 1);
      }
    },

    async editMaterial(id, materialTitle, materialDecription) {
      let formData = new FormData();
      if (materialDecription.length && materialTitle.length) {
        this.isDisabled = true;

        formData.append("title", materialTitle);
        formData.append("description", materialDecription);
        try {
          const response = await this.$api.post(
            "materials/edit/" + id,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            },
          );
          this.$toast.success("Materiał edytowano");
          this.textareaHeight();
          this.showEditModal = false;
          this.isDisabled = false;
          this.loadMaterials();
        } catch {
          this.$toast.error("Error. Spróbuj ponownie.");
          this.isDisabled = false;
        }
      }
    },

    async removeMaterial(id) {
      try {
        await this.$api.delete("materials/delete/" + id);
        const index = this.materials.findIndex((index) => index.id === id);
        if (index !== -1) {
          this.materials.splice(index, 1);
          this.showModalConfirmation = false;
          this.$toast.success("Materiał usunięto");
        }
        this.loadMaterials();
      } catch {
        this.$toast.error("Error");
      }
    },
    handleFileUpload() {
      this.file = this.$refs.file.files[0];
    },
    async loadMaterials() {
      this.textareaHeight();

      const response = await this.$api.get("/materials");
      this.materials = response.data.data;
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
