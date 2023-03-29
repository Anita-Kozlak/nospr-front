<template>
  <div class="section-admin-users page-header">
    <div id="div_background">
      <div style="background-image: url('img/background_image.jpg')"></div>
    </div>
    <div class="buttons">
      <NuxtLink to="/" class="navbar btn-mainview"> Strona główna </NuxtLink>
      <sign-out></sign-out>
    </div>
    <div class="container">
      <div id="contentAreas" class="cd-section">
        <div id="tables">
          <div class="row">
            <div class="col-md-8 ml-auto mr-auto">
              <card class="card-plain">
                <div class="row">
                  <div class="col-sm-12 card-users">
                    <input
                      v-model="search"
                      placeholder="szukaj"
                      class="input-search pull-left"
                    />
                    <div class="section-users pull-right">
                      <div class="section-user">
                        <div class="circle-green"></div>
                        <h4>- Użytkownik</h4>
                      </div>
                      <div class="section-admin">
                        <div class="circle-yellow"></div>
                        <h4>- Admin</h4>
                      </div>
                    </div>
                    <el-table
                      :data="
                        users.filter(
                          (data) =>
                            !search ||
                            data.name
                              .toLowerCase()
                              .includes(search.toLowerCase()) ||
                            data.surname
                              .toLowerCase()
                              .includes(search.toLowerCase()),
                        )
                      "
                    >
                      <el-table-column
                        min-width="10"
                        type="index"
                      ></el-table-column>
                      <el-table-column
                        min-width="80"
                        align="left"
                        prop="name"
                        label="Imię"
                      >
                      </el-table-column>
                      <el-table-column
                        min-width="80"
                        align="left"
                        prop="surname"
                        label="Nazwisko"
                      >
                      </el-table-column>
                      <el-table-column
                        min-width="170"
                        prop="email"
                        align="left"
                        label="Email"
                      >
                      </el-table-column>

                      <el-table-column min-width="120" label="Zespół">
                        <template slot-scope="scope">
                          <select
                            class="select-success select-card-styles select-team"
                            v-model="scope.row.team_id"
                          >
                            <option
                              v-for="team in teams"
                              :value="team.id"
                              :key="team.id"
                            >
                              {{ team.name }}
                            </option>
                          </select>
                        </template>
                      </el-table-column>
                      <el-table-column
                        min-width="160"
                        header-align="right"
                        label=""
                      >
                        <template slot-scope="scope">
                          <div class="buttons-active">
                            <button
                              v-if="scope.row.active === '0'"
                              @click="activeUser(scope.row)"
                              class="btn-active btn btn-red"
                            >
                              Aktywuj
                            </button>
                            <button
                              v-if="scope.row.role === 'user'"
                              class="btn-green btn"
                            >
                              Aktywny
                            </button>
                            <button
                              v-if="scope.row.role === 'admin'"
                              class="btn btn-yellow"
                            >
                              Aktywny<br />
                            </button>
                            <button
                              @click="activeUser(scope.row)"
                              class="btn-blue btn"
                            >
                              Zapisz
                            </button>
                            <button
                              @click.prevent="
                                deleteRow(
                                  scope.row.id,
                                  scope.$index,
                                  scope.row.name,
                                  scope.row.surname,
                                )
                              "
                              type="text"
                              size="small"
                              class="btn btn-delete-user"
                            >
                              Usuń
                            </button>
                          </div>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
              </card>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Card, Button, Checkbox, FormGroupInput } from "@/components";
import { Table, TableColumn, Tooltip } from "element-ui";
import SignOut from "../components/SignOut.vue";

export default {
  components: {
    Card,
    Button,
    SignOut,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Tooltip.name]: Tooltip,
    [Checkbox.name]: Checkbox,
    [Button.name]: Button,
    [FormGroupInput.name]: FormGroupInput,
    [Tooltip.name]: Tooltip,
  },
  mounted() {
    this.loadUsers(), this.loadTeams();
  },
  data() {
    return {
      removeId: null,
      user: "",
      search: "",
      users: [],
      active: false,
      errorTeam: "",
      teams: [],
    };
  },
  methods: {
    async activeUser(userRow) {
      this.active = true;

      if (userRow.team_id) {
        await this.$api.post("/user/activate/" + userRow.id, {
          active: this.active,
          team: userRow.team_id,
        });
        this.loadUsers();
        this.$toast.success("Zapisano");
      } else {
        this.$toast.error("Wybierz zespół");
      }
    },
    async deleteRow(selectedId, id, name, surname) {
      if (
        confirm(
          `"Czy na pewno chcesz usunąć użytkownika ${name}${surname}?"`,
        ) == true
      ) {
        await this.$api.delete("user/delete/" + selectedId);
        this.users.splice(id, 1);
      }
    },
    addTeam(id, rows) {
      rows[id].team = this.tableData.team;
    },
    async loadUsers() {
      const response = await this.$api.get("user/get");
      this.users = response.data.users;
    },
    async loadTeams() {
      const response = await this.$api.get("teams");
      this.teams = response.data.teams;
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
el-table td.el-table__cell {
  border: none;
}
</style>
