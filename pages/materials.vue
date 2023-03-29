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
              <h3 class="heading heading-materials">Materiały</h3>
              <div class="loader loader-materials" v-if="loading">
                Loading...
              </div>
              <div
                v-if="$store.state.user.role === 'admin'"
                @click="openModal()"
                type="success"
                class="pull-left btn btn-add-announcement"
              >
                Dodaj materiały
              </div>
              <h4 class="section-title" v-if="!materials.length">
                Brak materiałów
              </h4>
              <div class="media-area">
                <comment
                  :materials="materials"
                  :loadMaterials="loadMaterials"
                />
                <n-pagination
                  v-if="materials.length"
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
                  placeholder="Tytuł"
                  @keyup="validateTitle"
                />
                <div class="text-error">{{ errorTitle }}</div>
                <textarea
                  class="form-control"
                  @keyup="validateDescription"
                  placeholder="Opis"
                  rows="6"
                  v-model="info"
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
                    @click="addMaterial()"
                  >
                    Dodaj
                  </button>
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
import Comment from "../components/SheetMusic/Comment";
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
    this.loadMaterials();
  },
  data() {
    const today = new Date();
    return {
      //pagination
      pageCount: 0,
      perPage: 0,
      total: 0,
      value: 0,
      currentPage: 1,

      //materials
      errorDescription: "",
      file: "",
      files: [],
      title: "",
      errorTitle: "",
      file_title: "",
      info: "",
      materials: [],
      today: today.toLocaleDateString(),
      showModal: false,
      loading: false,
      isDisabled: false,
    };
  },

  methods: {
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
      if (!this.info) {
        this.$set(this, "errorDescription", "To pole jest obowiązkowe.");
      } else {
        this.$set(this, "errorDescription", "");
      }
    },
    async pageChange(value) {
      const response = await this.$api.get("materials?page=" + value);
      this.materials = response.data.data;
      let messageBody = document.getElementById("media-scroll");
      messageBody.scrollTo(0, 0);
    },

    async addMaterial() {
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
        formData.append("description", this.info);
        formData.append("file_title", this.file_title);
        try {
          await this.$api.post("/materials/create", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          this.$toast.success("Dodano materiał");
          this.title = "";
          this.info = "";
          this.file_title = "";
          this.$refs.files.value = null;

          this.showModal = false;
          await this.loadMaterials();
        } catch {
          this.$toast.error("Error");
        }
      }

      this.isDisabled = false;
    },

    handleFilesUpload() {
      this.files = this.$refs.files.files;
    },

    async loadMaterials() {
      this.loading = true;
      const response = await this.$api.get("materials");
      this.materials = response.data.data;
      this.currentPage = response.data.current_page;
      this.total = response.data.total;
      this.perPage = response.data.perPage;
      this.pageCount = response.data.last_page;

      this.loading = false;
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
