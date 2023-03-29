<script>
import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Tooltip } from "element-ui";
import { Modal } from "@/components";
import Collapse from "./pages/components/Collapse.vue";
import CollapseItem from "./pages/components/CollapseItem.vue";

import Checkbox from "./Inputs/Checkbox.vue";
import SignOut from "./SignOut";

export default {
  components: {
    Collapse,
    CollapseItem,
    FullCalendar,
    Modal,
    Checkbox,
    [Tooltip.name]: Tooltip,
    SignOut,
    Draggable,
  },

  created() {
    this.$moment().locale("pl");
    this.loadEvents();
  },

  data() {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        locale: "pl",
        initialView: "dayGridMonth",
        contentHeight: "auto",
        headerToolbar: false,
        dateClick: this.onDateClick,
        eventClick: this.onEventClick,
        eventDrop: this.onEventDrop,
        eventResize: this.onEventDrop,
        editable: true,
        firstDay: 1,
        allDaySlot: false,
        eventStartEditable: true,
        dateTimeFormat: {
          hour: "numeric",
          minute: "numeric",
          meridiem: false,
        },
        nextDayThreshold: "09:00",
        fixedWeekCount: true,
        droppable: true,
        showNonCurrentDates: false,
        //  eventDisplay: 'list-item'
      },

      events: null,
      eventModel: {
        id: "",
        title: "",
        className: "btn-info",
        description: "",
        squad: "",
        cast: "",
        start: "",
        end: "",
        allDay: false,
        location: "",
        timeStart: "",
        timeEnd: "",
        errorTitle: "",
        errorTime: "",
      },
      showEventModal: false,
      showNotificationModal: false,
      eventModalMode: "add",
      eventColors: [
        "btn-warning",
        "btn-danger",
        "btn-black",
        "btn-brown",
        "btn-success",
        "btn-light",
        "btn-blue",
        "btn-info",
      ],
      currentDate: this.$moment(),
      currentView: "dayGridMonth",
    };
  },
  computed: {
    currentMonth() {
      return this.$moment(this.currentDate).format("MMMM YYYY");
    },
    date() {
      return this.$moment(this.currentDate).format("DD MMMM YYYY");
    },
  },
  methods: {
    onDateClick({ date }) {
      if (this.$store.state.user.role === "user") return false;
      this.resetEventModel();
      this.eventModel.start = date;
      this.eventModel.end = date;
      this.eventModalMode = "add";
      this.showEventModal = true;
    },
    onEventClick({ event }) {
      this.eventModel = {
        id: event.id,
        title: event.title,
        className: event.classNames ? event.classNames.join(" ") : "",
        start: event.start,
        end: event.end,
        location: event.extendedProps.location,
        description: event.extendedProps.description,
        allDay: event.allDay,
        timeStart: event.extendedProps.timeStart,
        timeEnd: event.extendedProps.timeEnd,
        squad: event.extendedProps.squad,
        cast: event.extendedProps.cast,
        notification: false,
      };
      this.eventModalMode = "edit";
      this.showEventModal = true;
    },
    onEventDrop({ event }) {
      this.eventModel = {
        id: event.id,
        title: event.title,
        allDay: event.allDay,
        className: event.classNames ? event.classNames.join(" ") : "",
        start: event.start,
        end: event.end,
        location: event.extendedProps.location,
        description: event.extendedProps.description,
        timeStart: event.extendedProps.timeStart,
        timeEnd: event.extendedProps.timeEnd,
        squad: event.extendedProps.squad,
        cast: event.extendedProps.cast,
      };
      this.processEvent();
      // this.deleteEvent();
    },

    setHoursAllDay() {
      !this.eventModel.allDay
        ? (this.eventModel = {
            ...this.eventModel,
            timeStart: "00:00",
            timeEnd: "00:00",
          })
        : null;
    },
    async processEvent() {
      this.validateTitle();
      this.validateTime();
      this.showNotificationModal = true;

      const url =
        this.eventModalMode === "edit"
          ? "calendar/edit-event/" + this.eventModel.id
          : "calendar/add-event";
      //Prepare proper form data object
      let formData = new FormData();
      formData.append("title", this.eventModel.title);
      formData.append("description", this.eventModel.description);
      formData.append(
        "start",
        this.$moment(this.eventModel.start).format("YYYY-MM-DD") +
          " " +
          this.eventModel.timeStart,
      );

      formData.append(
        "end",
        this.$moment(
          this.eventModel.end ? this.eventModel.end : this.eventModel.start,
        ).format("YYYY-MM-DD") +
          " " +
          this.eventModel.timeEnd,
      );
      formData.append("allday", this.eventModel.allDay ? 1 : 0);
      formData.append("color", this.eventModel.className);
      formData.append("location", this.eventModel.location);
      if (
        this.eventModel.timeStart === "00:00" &&
        this.eventModel.timeEnd === "00:00"
      ) {
        formData.append("color", "btn-PI");
      }
      if (this.eventModel.location === "sala główna") {
        formData.append("color", "btn-warning");
      }

      if (this.eventModel.location === "369") {
        formData.append("color", "btn-black");
      }
      if (this.eventModel.location === "sala kameralna") {
        formData.append("color", "btn-brown");
      }
      if (this.eventModel.location === "374") {
        formData.append("color", "btn-light");
      }
      if (this.eventModel.location === "372") {
        formData.append("color", "btn-light");
      }
      if (this.eventModel.location === "366") {
        formData.append("color", "btn-blue");
      }

      if (
        ["sala główna", "372", "374", "sala kameralna", "366", "369"].every(
          (el) => this.eventModel.location !== el,
        ) &&
        this.eventModel.location.length
      ) {
        formData.append("color", "btn-info");
      }
      formData.append(
        "squad",
        this.eventModel.squad !== undefined ? this.eventModel.squad : "",
      );
      formData.append(
        "cast",
        this.eventModel.cast !== undefined ? this.eventModel.cast : "",
      );

      if (this.eventModalMode === "edit" || this.eventModalMode === "add") {
        formData.append("notification", this.eventModel.notification);
      }

      if (!this.eventModel.errorTitle && !this.eventModel.errorTime) {
        await this.$api.post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        //Reset input files
        if (this.eventModalMode === "edit") {
          const getEventsRequest = await this.$api.post(
            "/calendar/get-events",
            {
              from: this.$moment(this.currentDate).format("YYYY-MM-01"),
              to:
                this.$moment(this.currentDate).format("YYYY-MM-") +
                this.$moment(this.currentDate).daysInMonth(),
            },
          );
          const from = JSON.parse(getEventsRequest.config.data).from;
          const to = JSON.parse(getEventsRequest.config.data).to;
          if (!!this.eventModel.notification) {
            this.$router.push({
              path: "calendar",
              query: { start: from, end: to, event: this.eventModel.id },
            });
          }
        }

        await this.loadEvents();
        this.showEventModal = false;
      }
    },
    async deleteEvent() {
      await this.$api.post("calendar/delete-event/" + this.eventModel.id);
      await this.loadEvents();
      this.showEventModal = false;
    },
    deleteCastFile() {
      this.eventModel.cast = "";
    },
    deleteSquadFile() {
      this.eventModel.squad = "";
    },
    transformEvents() {
      return this.events.map((event) => ({
        id: event.id,
        start: event.start,
        end: this.$moment(event.end).format("YYYY-MM-DD"),
        allDay: event.allday == 1 ? true : false,
        className:
          this.$route.query.event == event.id
            ? "btn-change-event"
            : event.color,
        title: event.title,
        location: event.location,
        description: event.description,
        cast: event.cast,
        squad: event.squad,
        timeStart: this.$moment(event.start).format("HH:mm"),
        timeEnd: this.$moment(event.end).format("HH:mm"),
      }));
    },
    validateTitle() {
      if (!this.eventModel.title) {
        this.$set(this.eventModel, "errorTitle", "To pole jest obowiązkowe.");
      } else {
        this.$set(this.eventModel, "errorTitle", "");
      }
    },
    validateTime() {
      if (
        !this.eventModel.timeStart &&
        !this.eventModel.timeEnd &&
        this.eventModel.allDay === false
      ) {
        this.$set(this.eventModel, "errorTime", "Te pola są obowiązkowe.");
      }
      if (this.eventModel.timeStart && this.eventModel.timeEnd) {
        this.$set(this.eventModel, "errorTime", "");
      }
    },
    async loadEvents() {
      if (this.$route.query.event) {
        const getEventsRequest = await this.$api.post("/calendar/get-events", {
          from: this.$route.query.start,
          to: this.$route.query.end,
        });

        this.events = getEventsRequest.data.events;
        this.$set(this.calendarOptions, "events", this.transformEvents());
        this.calendarApi().gotoDate(this.$route.query.start);
      } else {
        const getEventsRequest = await this.$api.post("/calendar/get-events", {
          from: this.$moment(this.currentDate).format("YYYY-MM-01"),
          to:
            this.$moment(this.currentDate).format("YYYY-MM-") +
            this.$moment(this.currentDate).daysInMonth(),
        });
        this.events = getEventsRequest.data.events;
        this.$set(this.calendarOptions, "events", this.transformEvents());
      }
      this.calendarApi().getDate();
      this.currentDate = this.calendarApi().getDate();
    },
    resetEventModel() {
      this.eventModel = {
        id: "",
        title: "",
        location: "",
        className: "btn-info",
        description: "",
        start: "",
        end: "",
        allDay: false,
        timeStart: "",
        timeEnd: "",
        castFile: "",
        squadFile: "",
        notification: false,
      };
    },
    calendarApi() {
      return this.$refs.fullCalendar.getApi();
    },
    changeView(viewType) {
      this.currentView = viewType;
      this.calendarApi().changeView(viewType);
    },
    async next() {
      this.calendarApi().next();
      this.currentDate = this.calendarApi().getDate();
      this.$router.push("");
      setTimeout(() => {
        this.loadEvents();
      }, 100);
    },
    async prev() {
      this.calendarApi().prev();
      this.currentDate = this.calendarApi().getDate();
      this.$router.push("");
      setTimeout(() => {
        this.loadEvents();
      }, 100);
    },
    closeModal() {
      this.showEventModal = false;
    },
    exportCSV(month) {
      const csvString = [
        [
          "Subject",
          "Start Date",
          "Start Time",
          "End Date",
          "End Time",
          "All day event",
          "Location",
        ],
        ...this.calendarOptions.events.map((item) => [
          item.title,
          this.$moment(item.start).format("MM/DD/YYYY"),
          item.timeStart.split(":")[0] < 12
            ? item.timeStart + " AM"
            : item.timeStart + " PM",

          this.$moment(item.end).format("MM/DD/YYYY"),
          item.timeEnd.split(":")[0] < 12
            ? item.timeEnd + " AM"
            : item.timeEnd + " PM",

          item.allDay,
          item.location,
        ]),
      ]
        .map((e) => e.join(","))
        .join("\n");
      let csvContent = "data:text/csv;charset=utf-8," + csvString;

      var hiddenElement = document.createElement("a");
      hiddenElement.href = encodeURI(csvContent);
      hiddenElement.target = "_blank";

      hiddenElement.download = `${month}.csv`;
      hiddenElement.click();
    },
  },
};
</script>
<template>
  <div class="page-header page-opacity">
    <div id="div_background">
      <div style="background-image: url('img/background_image.jpg')"></div>
    </div>

    <div class="buttons">
      <NuxtLink to="/" class="navbar btn-mainview"> Strona główna </NuxtLink>
      <sign-out></sign-out>
    </div>
    <header class="pb-6">
      <div class="row align-items-center">
        <div class="col-lg-6 mt-lg-0 text-lg-right">
          <a
            href="#"
            @click.prevent="prev"
            class="fullcalendar-btn-prev btn btn-sm btn-default"
          >
            <i class="fas fa-angle-left"></i>
          </a>
          <a
            href="#"
            @click.prevent="next"
            class="fullcalendar-btn-next btn btn-sm btn-default"
          >
            <i class="fas fa-angle-right"></i>
          </a>
          <button
            class="btn btn-sm btn-default"
            name=""
            :class="{ active: currentView === 'dayGridMonth' }"
            @click="changeView('dayGridMonth')"
          >
            Miesiąc
          </button>
          <!-- <button
            class="btn btn-sm btn-default"
            :class="{ active: currentView === 'dayGridWeek' }"
            @click="changeView('dayGridWeek')"
          >
            Tydzień
          </button> -->
          <!-- <button
            class="btn btn-sm btn-default"
            :class="{ active: currentView === 'timeGridDay' }"
            @click="changeView('timeGridDay')"
          >
            Dzień
          </button> -->
          <button
            class="btn-green btn-sm btn btn-default"
            @click="exportCSV(currentMonth)"
          >
            Export excel
          </button>
        </div>
      </div>
    </header>

    <div class="container-fluid mt--6">
      <div class="row">
        <div class="col">
          <!-- Fullcalendar -->
          <div class="card card-calendar">
            <!-- Card header -->
            <div class="card-header">
              <!-- Title -->
              <h5 v-if="currentView === 'dayGridMonth'" class="h3 mb-0">
                {{ currentMonth }}
              </h5>

              <h5 v-if="currentView === 'timeGridDay'" class="h3 mb-0 p-2">
                {{ this.$moment(this.currentDate).format("YYYY-MM-DD") }}
              </h5>
            </div>
            <!-- Card body -->
            <div class="card-body p-0 card-calendar-body">
              <FullCalendar
                v-if="this.$store.state.user.role === 'user'"
                v-touch:swipe.left="next"
                v-touch:swipe.right="prev"
                :options="calendarOptions"
                ref="fullCalendar"
              />
              <FullCalendar
                v-else
                :options="calendarOptions"
                ref="fullCalendar"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <modal
      @close="closeModal"
      :show.sync="showEventModal"
      modal-classes="modal-secondary"
      ><h3>{{ this.$moment(this.eventModel.start).format("YYYY-MM-DD") }}</h3>
      <h4
        v-if="this.$store.state.user.role === 'admin'"
        slot="header"
        class="title"
      >
        {{
          eventModalMode === "add" ? "Dodaj wydarzenie" : "Edytuj wydarzenie"
        }}
      </h4>
      <h4 slot="header"></h4>
      <form class="event-form">
        <div class="form-title">
          <label class="form-control-label form-control-label-calendar"
            >Tytuł</label
          >
          <div label="tytuł">
            <div v-if="$store.state.user.role === 'user'">
              {{ eventModel.title }}
            </div>
            <input
              v-if="$store.state.user.role === 'admin'"
              v-model="eventModel.title"
              @keyup="validateTitle"
              class="form-control form-control-alternative"
            />
          </div>
          <div class="text-error">{{ eventModel.errorTitle }}</div>
        </div>
        <div class="form-time">
          <label class="form-control-label form-control-label-calendar"
            >Godzina</label
          >
          <div class="text-error" v-if="eventModel.allDay === 1">
            cały dzień
          </div>

          <div v-if="$store.state.user.role === 'user'">
            {{ eventModel.timeStart }} - {{ eventModel.timeEnd }}
          </div>
          <div v-if="$store.state.user.role === 'admin'" class="input-time">
            <input
              v-model="eventModel.timeStart"
              placeholder="start"
              class="new-event--start form-control"
              type="time"
              @keyup="validateTime"
            />
            <input
              v-model="eventModel.timeEnd"
              placeholder="koniec"
              class="new-event--end form-control"
              type="time"
              @keyup="validateTime"
            />
            <div class="checkbox-day">
              <input
                type="checkbox"
                id="checkbox"
                v-model="eventModel.allDay"
                @click="setHoursAllDay"
              /><label class="day">Cały dzień</label>
            </div>
          </div>

          <div class="text-error" v-if="eventModel.allDay === false">
            {{ eventModel.errorTime }}
          </div>
        </div>
        <div class="form-location">
          <label class="form-control-label form-control-label-calendar"
            >Gdzie</label
          >
          <div v-if="$store.state.user.role === 'user'">
            {{ eventModel.location }}
          </div>
          <div class="d-flex">
            <select
              v-if="$store.state.user.role === 'admin'"
              class="select-success select-location mr-4"
              v-model="eventModel.location"
            >
              <option>sala główna</option>
              <option>sala kameralna</option>
              <option>366</option>
              <option>368</option>
              <option>372</option>
              <option>374</option>
            </select>
            <input
              v-if="$store.state.user.role === 'admin'"
              type="text"
              class="form-control form-control-alternative"
              placeholder="wpisz inną lokalizację"
              v-model="eventModel.location"
            />
          </div>
        </div>
        <div class="form-group" v-if="$store.state.user.role === 'admin'">
          <!-- <div class="btn-group btn-group-toggle btn-group-colors event-tag">
            <label v-for="color in eventColors"
                   :key="color"
                   class="btn btn-status rounded-circle"
                   :class="[color, {'active focused': eventModel.className === color}]">
              <input v-model="eventModel.className" type="radio" name="event-tag" :value="color" autocomplete="off" class="input">
            </label>
          </div> -->
          <div></div>
        </div>
        <label class="form-control-label form-control-label-calendar"
          >Opis</label
        >
        <div label="Description">
          <b-form-textarea
            rows="2"
            max-rows="10"
            v-if="$store.state.user.role === 'user'"
            v-model="eventModel.description"
            class="form-control form-control-alternative edit-event--description textarea-autosize textarea-description"
            readonly
          >
            <pre>{{ eventModel.description }}</pre>
          </b-form-textarea>
          <textarea
            rows="10"
            v-else-if="$store.state.user.role === 'admin'"
            v-model="eventModel.description"
            class="form-control form-control-alternative edit-event--description textarea-autosize textarea-description text-announcement"
          >
          </textarea>
          <i class="form-group--bar"></i>
        </div>

        <div class="form-files">
          <div class="calendar-squad">
            <div class="row">
              <div class="col-md-12">
                <collapse>
                  <collapse-item title="Skład">
                    <b-form-textarea
                      rows="2"
                      max-rows="10"
                      v-if="$store.state.user.role === 'user'"
                      class="form-control form-control-alternative edit-event--description textarea-autosize textarea-description"
                      readonly
                    >
                      <pre>{{ eventModel.squad }}</pre>
                    </b-form-textarea>

                    <textarea
                      v-else-if="$store.state.user.role === 'admin'"
                      v-model="eventModel.squad"
                      rows="15"
                      class="form-control form-control-alternative edit-event--description textarea-autosize textarea-description text-announcement"
                    >
                    </textarea>
                  </collapse-item>
                </collapse>
              </div>
            </div>
          </div>
          <div class="calendar-cast">
            <div class="row">
              <div class="col-md-12">
                <collapse>
                  <collapse-item title="Obsada">
                    <b-form-textarea
                      rows="2"
                      max-rows="10"
                      v-if="$store.state.user.role === 'user'"
                      class="form-control form-control-alternative edit-event--description textarea-autosize textarea-description"
                      readonly
                    >
                      <pre>{{ eventModel.cast }}</pre>
                    </b-form-textarea>
                    <textarea
                      rows="10"
                      v-else-if="$store.state.user.role === 'admin'"
                      v-model="eventModel.cast"
                      class="form-control form-control-alternative edit-event--description textarea-autosize textarea-description text-announcement"
                    >
                    </textarea>
                  </collapse-item>
                </collapse>
              </div>
            </div>
          </div>
        </div>
      </form>
      <template slot="footer">
        <button
          v-if="
            eventModalMode === 'add' && this.$store.state.user.role === 'admin'
          "
          class="btn"
          @click="processEvent"
        >
          Dodaj
        </button>
        <button
          v-if="
            eventModalMode === 'edit' && this.$store.state.user.role === 'admin'
          "
          type="primary"
          class="btn btn-secondary"
          @click="processEvent"
        >
          Edytuj
        </button>
        <button
          v-if="
            eventModalMode === 'edit' && this.$store.state.user.role === 'admin'
          "
          class="btn btn-red"
          @click="deleteEvent"
        >
          Usuń
        </button>
        <button type="link" class="btn btn-link ml-auto" @click="closeModal">
          Zamknij
        </button>
      </template>
      <div
        v-if="this.$store.state.user.role === 'admin'"
        class="notification-checkbox"
      >
        <input type="checkbox" v-model="eventModel.notification" /><label
          class="notification"
          >Wyślij powiadomienie do użytkowników aplikacji</label
        >
      </div>
    </modal>
  </div>
</template>
<style>
.btn-change-event {
  border: 3px solid red !important;
  background: rgb(243, 240, 240);
  color: black !important;
}
.fc-daygrid-event-dot {
  margin: 0 !important;
}
.page-opacity {
  background-color: rgba(0, 0, 0, 0.6);
}
.fc-event-time {
  font-weight: 600;
}
.fc-h-event .fc-event-title {
  color: black !important;
  font-weight: 600;
}
.fc th {
  padding: 0 !important;
}
.btn-info {
  margin: 1px 2px 0 !important;
}
</style>
