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
            <div class="col-md-8 ml-auto mr-auto section-announcement">
              <div class="announcements-block">
                <NuxtLink to="announcements-artistic" class="announcement">
                  Ogłoszenia Artystyczne
                </NuxtLink>
                <NuxtLink
                  to="announcements-administrative"
                  class="announcement"
                >
                  Ogłoszenia Administracyjne
                </NuxtLink>
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
  FormGroupInput,
  Pagination,
  Modal,
} from "@/components";
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
    Modal,
    SignOut,
  },
  data() {
    const today = new Date();
    return {
      pageCount: 0,
      perPage: 0,
      total: 0,
      value: 0,
      currentPage: 1,

      teams: [],
      errorDescription: "",
      file: "",
      files: [],
      info: "",
      announcements: [],
      today: today.toLocaleDateString(),
      showModal: false,
    };
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
