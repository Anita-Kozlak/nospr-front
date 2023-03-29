<template>
  <div class="page-regulations">
    <div id="div_background">
      <div style="background-image: url('img/background_image.jpg')"></div>
    </div>

    <div class="buttons">
      <NuxtLink to="/" class="navbar btn-mainview"> Strona główna </NuxtLink>
      <sign-out></sign-out>
    </div>
    <div class="section">
      <div class="container container-height">
        <div class="row regulations-column">
          <div class="col-md-8 ml-auto mr-auto regulations-container">
            <h3 class="heading-white">Regulaminy</h3>
            <div class="loader loader-regulations" v-if="loading">
              Loading...
            </div>
            <div
              v-for="regulation in regulations"
              :key="regulation.id"
              :id="regulation.id"
              class="media-regulation"
            >
              <div
                v-for="(file, index) in regulation.files"
                :key="index"
                class="text-file"
              >
                <a
                  :href="`${$api.defaults.baseURL}/docs/${file.file}`"
                  class="regulation-title"
                  target="_blank"
                >
                  {{ regulation.description }}
                </a>
                <el-tooltip
                  v-if="$store.state.user.role === 'admin'"
                  content="Usuń"
                  placement="top"
                >
                  <button
                    type="button"
                    class="btn-remove-white"
                    @click="removeRegulation(regulation.id)"
                  >
                    <i class="now-ui-icons ui-1_simple-remove"></i>
                  </button>
                </el-tooltip>
              </div>
            </div>
            <button
              v-if="$store.state.user.role === 'admin'"
              @click="openModal()"
              type="success"
              class="pull-left btn btn-add-regulation"
            >
              Dodaj regulamin
            </button>
          </div>
        </div>
        <modal :show.sync="showModal" headerClasses="justify-content-center">
          <h4 slot="header" class="title title-up"></h4>
          <textarea
            class="form-control form-info form-regulation"
            placeholder="Tytuł regulaminu"
            rows="6"
            v-model="description"
          ></textarea>
          <div class="text-error">{{ errorDescription }}</div>
          <input
            class="pull-left"
            type="file"
            ref="files"
            v-on:change="handleFilesUpload()"
          />
          <div class="media-footer">
            <button
              type="success"
              class="pull-right btn"
              @click="addRegulation"
            >
              Dodaj
            </button>
          </div>
        </modal>
      </div>
    </div>
  </div>
</template>
<script>
import { Tooltip } from "element-ui";
import SignOut from "../components/SignOut";
import { Modal } from "@/components";

export default {
  components: {
    [Tooltip.name]: Tooltip,
    SignOut,
    Modal,
  },
  mounted() {
    this.loadRegulations();
  },
  data() {
    return {
      files: [],
      description: "",
      regulations: [],
      errorDescription: "",
      showModal: false,
      loading: false,
    };
  },
  methods: {
    openModal() {
      this.showModal = true;
    },
    validateDescription() {
      if (!this.description) {
        this.$set(this, "errorDescription", "To pole jest obowiązkowe.");
      } else {
        this.$set(this, "errorDescription", "");
      }
    },

    handleFilesUpload() {
      this.files = this.$refs.files.files;
      return;
    },

    async addRegulation() {
      this.validateDescription();
      if (!this.errorDescription) {
        let formData = new FormData();
        for (var i = 0; i < this.files.length; i++) {
          let file = this.files[i];
          formData.append("files[" + i + "]", file);
        }
        formData.append("description", this.description);
        await this.$api.post("/regulations/create", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        this.showModal = false;
      }
      this.description = "";
      this.files = [];
      await this.loadRegulations();
    },

    async removeRegulation(id) {
      await this.$api.delete("regulations/delete/" + id);
      const index = this.regulations.findIndex((index) => index.id === id);
      if (index !== -1) {
        this.regulations.splice(index, 1);
      }
    },

    async loadRegulations() {
      this.loading = true;
      const response = await this.$api.get("regulations");
      this.regulations = response.data.data;
      this.loading = false;
    },
  },
};
</script>