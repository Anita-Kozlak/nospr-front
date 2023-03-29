<template>
  <div class="page-header signup-page section-image page-opacity">
    <div id="div_background">
      <div style="background-image: url('img/background_image.jpg')"></div>
    </div>
    <div class="content">
      <div class="container">
        <div
          class="col-md-5 ml-auto mr-auto text-center"
          style="{display: 'flex}"
        >
          <img v-lazy="'img/nospr_logo.jpg'" alt="logo" />
          <card type="login" plain>
            <fg-input
              class="no-border input-lg"
              addon-left-icon="now-ui-icons text_caps-small"
              placeholder="Imię"
              type="text"
              @keyup="validateName"
              v-model="name"
            >
            </fg-input>
            <p class="form-error" v-if="!validation.name.isValid">
              {{ validation.name.message }}
            </p>

            <fg-input
              class="no-border input-lg"
              addon-left-icon="now-ui-icons text_caps-small"
              placeholder="Nazwisko"
              type="text"
              @keyup="validateSurname"
              v-model="surname"
            >
            </fg-input>
            <p class="form-error" v-if="!validation.surname.isValid">
              {{ validation.surname.message }}
            </p>

            <fg-input
              class="no-border input-lg"
              addon-left-icon="now-ui-icons ui-1_email-85"
              type="email"
              placeholder="Email"
              @keyup="validateEmail"
              v-model="email"
            >
            </fg-input>
            <p class="form-error" v-if="!validation.email.isValid">
              {{ validation.email.message }}
            </p>

            <fg-input
              class="no-border input-lg"
              v-mask="'+48#########'"
              addon-left-icon="now-ui-icons tech_mobile"
              placeholder="Numer telefonu"
              @keyup="validatePhoneNumber"
              v-model="phoneNumber"
            >
            </fg-input>
            <p class="form-error" v-if="!validation.phoneNumber.isValid">
              {{ validation.phoneNumber.message }}
            </p>

            <div class="d-flex field-password">
              <fg-input
                class="no-border input-lg input-password"
                addon-left-icon="now-ui-icons objects_key-25"
                :type="passwordFieldType"
                placeholder="Hasło"
                @keyup="validatePassword"
                v-model="password"
              >
              </fg-input>
              <button
                class="show-password"
                type="password"
                @click="switchVisibility"
              ></button>
            </div>
            <p class="form-error mt-2" v-if="!validation.password.isValid">
              {{ validation.password.message }}
            </p>

            <n-checkbox @input="validateAgree" v-model="agree">
              <span @click="modals.classic = true"
                >Zaakceptuj politykę prywatności</span
              >

              <!-- <span class="mt-2"
              >Klikając w przycisk Zarejestruj się, zgadzasz się z naszą
              <span class="open-modal" @click="modals.classic = true"
                >polityką prywatności</span
              ></span
            > -->
            </n-checkbox>

            <p class="form-error-checkbox" v-if="!validation.agree.isValid">
              {{ validation.agree.message }}
            </p>

            <template slot="raw-content">
              <div class="card-footer text-center">
                <a
                  class="btn btn-default btn-round btn-lg btn-block"
                  @click="registerUser"
                >
                  Zarejestruj się</a
                >
              </div>

              <div class="pull-left">
                <h6>
                  <div class="link footer-link">Masz konto?</div>
                </h6>
              </div>
              <div class="pull-right">
                <h6>
                  <router-link
                    v-popover:popover1
                    class="link footer-link"
                    to="login"
                  >
                    Zaloguj się
                  </router-link>
                </h6>
              </div>
            </template>
          </card>
        </div>
      </div>
    </div>
    <modal :show.sync="modals.classic" headerClasses="justify-content-center">
      <h4 slot="header" class="title title-upb title-regulation">
        Polityka prywatności platformy NOSPRU Inspektor
      </h4>
      <p class="text-secondary">
        § 1. [Postanowienia ogólne] <br /><br />
        Niniejszy dokument określa Politykę Prywatności Platformy NFM Inspektor,
        która w szczególności obejmuje regulacje dotyczące ochrony danych
        osobowych oraz bezpieczeństwa innych danych wprowadzonych do Platformy
        przez Użytkownika. Polityka Prywatności stanowi integralny załącznik do
        Regulaminu. <br /><br />§ 2. [Definicje] <br /><br />Terminy użyte w
        niniejszym dokumencie oznaczają: <br />
        1. Administrator danych osobowych (ADO) –Narodowe Forum Muzyki;
        <br />2. Platforma on-line dostępna poprzez sieć internet poprzez Stronę
        internetową;<br />3. Administrator Platformy-Softart Anita Koźlak
        (zarządca Platformy);<br />
        4. Strona internetowa –strona internetowa pod adresem
        https://inspektor.nfm.wroclaw.pl oraz wszelkie jej podstrony oraz
        subdomeny; <br />Strony – Administrator i Użytkownik;<br />
        Użytkownik – osoba fizyczna, która korzysta z Platformy i podaje w jego
        ramach swoje dane osobowe.<br /><br />§ 3.[Ochrona danych osobowych]<br /><br />
        1. Administrator Platformy jest podmiotem przetwarzającym w rozumieniu
        rozporządzenia o ochronie danych osobowych z dnia 27 kwietnia 2016 r.
        (RODO). <br />2. Administrator Platformy przetwarza dane w zakresie,
        czasie i celach każdorazowo wskazanych w treściach udostępnionych pod
        formularzami służącymi do zbierania danych osobowych od Użytkownika.<br />3.
        Dane osobowe będą przekazywane wyłącznie zaufanym podwykonawcom
        Administratora Platformy, tj. dostawcom usług informatycznych,
        administracji, zewnętrznym podmiotom wspierającym świadczenie usług
        przez Platformę na rzecz Użytkownika. <br />4. Dla wszystkich
        zalogowanych Pracowników przypisanych do Konta danego Klienta dostępne
        są następujące dane innych Pracowników: imię, nazwisko. Pozostałe dane
        są widoczne tylko dla Administratora Platformy oraz Pracownika, którego
        dane dotyczą. <br /><br />§4. [Uprawnienia Użytkownika]<br /><br />1. W
        przypadku zmiany danych osobowych, Użytkownik powinien uaktualnić je
        wysyłając stosowną wiadomość do Usługodawcy.<br />
        2. Użytkownikowi przysługuje prawo żądania dostępu do treści swoich
        danych osobowych, ich sprostowania, usunięcia oraz prawo do ograniczenia
        ich przetwarzania.<br />
        3. Użytkownikowi przysługuje prawo wniesienia skargi do Prezesa Urzędu
        Ochrony Danych Osobowych.<br />4. Podanie danych osobowych jest
        dobrowolne, jednakże brak wyrażenia zgody na przetwarzanie danych
        uniemożliwia korzystanie z Platformy.<br />5. Administrator Platformy
        może odmówić usunięcia danych osobowych Użytkownika, jeżeli zachowanie
        danych osobowych jest konieczne ze względu na obowiązek nałożony na
        Administratora Platformy przez przepisy prawa. <br /><br />
        §5. [Szyfrowanie danych] <br /><br />
        1. Administrator Platformy zobowiązuje się do szyfrowania transmisji
        danych w celu zabezpieczenia danych Użytkownika przechowywanych w
        systemie.<br />2. Każde połączenie Użytkownika z Platformą jest
        szyfrowane i poufne. <br /><br />§6. [Techniczna ochrona danych]
        <br /><br />1. Administrator Platformy wykorzystuje wszelkie techniczne
        i organizacyjne sposoby, by zapewnić bezpieczeństwo danym osobowym
        Użytkownika i chronić je przed przypadkowym lub celowym zniszczeniem,
        przypadkową utratą, modyfikacją, nieautoryzowanym ujawnieniem lub
        dostępem. Informacjesą przechowywane i przetwarzane na serwerach o
        wysokim stopniu zabezpieczeń, z zachowaniem odpowiednich środków
        bezpieczeństwa, spełniających wymogi polskiego prawa.<br />2.
        Administrator Platformy zobowiązuje się do przechowywania kopii
        bezpieczeństwa zawierających dane osobowe Użytkownika.<br />3.
        Powierzone dane są składowane na najwyższej klasy sprzęcie i serwerach w
        odpowiednio zabezpieczonych centrach przechowywania informacji, do
        których dostęp mają tylko upoważnione osoby.<br />4. Administrator
        Platformy przeprowadza czynności związane z przetwarzaniem danych
        osobowych z poszanowaniem wszystkich wymogów prawnych i technicznych
        nałożonych na niego przez przepisy dotyczące ochrony danych
        osobowych.<br /><br />§7. [Polityka cookies] <br /><br />Dla wygody
        Użytkowników Platforma używa plików cookies m.in. w celu dostosowania
        Platformy do potrzeb użytkowników oraz w celach statystycznych. Cookies
        to niewielkie pliki tekstowe wysyłane przez Platformę internetową, który
        odwiedza internauta, do urządzenia internauty. W ramach Platformy
        stosowane są dwa typy plików cookies: „sesyjne” (session cookies) oraz
        „stałe” (persistent cookies). Cookies „sesyjne” są plikami tymczasowymi,
        które przechowywane są w urządzeniu końcowym Użytkownika do czasu
        wylogowania, opuszczenia strony internetowej lub wyłączenia
        oprogramowania (przeglądarki internetowej). „Stałe” pliki cookies
        przechowywane są w urządzeniu końcowym Użytkownika przez czas określony
        w parametrach plików cookies lub do czasu ich usunięcia przez
        Użytkownika. W Platformie wykorzystujemy następujące rodzaje plików
        Cookies: <br />„niezbędne” - umożliwiają korzystanie z usług dostępnych
        w ramach Platformy, np. wykorzystywane przy obsłudze autoryzacji
        użytkowników;"zabezpieczające" - służą do zapewnienia bezpieczeństwa,
        np. wykorzystywane do wykrywania nadużyć w zakresie korzystania z usług
        Platformy;<br />„wydajnościowe” - umożliwiają zbieranie informacji o
        sposobie korzystania z Platformy; <br />„funkcjonalne” - umożliwiają
        zapamiętanie wybranych przez Użytkownika ustawień i personalizację
        interfejsu Użytkownika, np. w zakresie wybranego języka lub regionu, z
        którego pochodzi Użytkownik, rozmiaru czcionki, wyglądu Platformy itp.;
        <br />“integracyjne” - związane są z wykorzystywanymi w Platformie
        usługami firm trzecich, np. Google Analytics. Serwisy obce, których
        materiały przedstawiamy, mogą także używać cookies, które umożliwiają
        logowanie się, oraz służą dostarczaniu reklam odpowiadających
        upodobaniom i zachowaniom użytkownika. W przeglądarce internetowej można
        zmienić ustawienia dotyczące cookies. Brak zmiany tych ustawień oznacza
        akceptację dla stosowanych tu cookies. <br /><br />§8. [Logi]<br /><br />Zgodnie
        z praktyką większości serwisów www przechowujemy zapytania HTTP
        kierowane do naszego serwera (logi serwera). W związku z powyższym
        przechowujemy:adresy IP, z których użytkownicy przeglądają treści
        informacyjne naszej Platformy; czas nadejścia zapytania, czas wysłania
        odpowiedzi, nazwę stacji klienta - identyfikacja realizowana przez
        protokół HTTP, informacje o błędach jakie nastąpiły przy realizacji
        transakcji HTTP, adres URL strony poprzednio odwiedzanej przez
        użytkownika (referer link); informacje o przeglądarce użytkownika. Dane
        gromadzone w dziennikach logów, dane są wykorzystywane tylko i wyłącznie
        do celów administrowania Platformą. Zebrane logi przechowywane są przez
        czas nieokreślony jako materiał pomocniczy służący do administrowania
        Platformą. Informacje w nich zawarte nie są ujawniane nikomu poza
        osobami upoważnionymi do administrowania Platformą. Na podstawie plików
        logów mogą być generowane statystyki stanowiące pomoc w administrowaniu.
        Zbiorcze podsumowania w postaci takich statystyk nie zawierają żadnych
        cech identyfikujących osoby odwiedzające Platformę. <br /><br />§9.
        [Kontakt]<br /><br />1. Użytkownik może w dowolnym czasie skontaktować
        się z ADO w celu uzyskania informacji o tym, czy iw jaki sposób ADO
        wykorzystuje jego dane osobowe.<br />2. Użytkownik może również zwrócić
        się do ADO z prośbą o usunięcie jego danych osobowych w całości lub w
        określonej części.<br />3. Z ADO można skontaktować się wysyłając
        wiadomość na adres e-mail: iod@nfm.wroclaw.pl
      </p>
      <template slot="footer"> </template>
    </modal>
  </div>
</template>
<script>
import { Card, Button, FormGroupInput, Checkbox } from "@/components";
import MainFooter from "@/components/layout/MainFooter";
import { Modal } from "@/components";

export default {
  name: "signup-page",
  layout: "default-no-footer",
  components: {
    Card,
    Modal,
    MainFooter,
    [Button.name]: Button,
    [Checkbox.name]: Checkbox,
    [FormGroupInput.name]: FormGroupInput,
  },
  data() {
    return {
      modals: {
        classic: false,
      },
      name: "",
      surname: "",
      email: "",
      password: "",
      passwordFieldType: "password",
      phoneNumber: "",
      agree: false,
      validation: {
        name: {
          isValid: false,
          message: "",
        },
        surname: {
          isValid: false,
          message: "",
        },
        email: {
          isValid: false,
          message: "",
        },
        phoneNumber: {
          isValid: false,
          message: "",
        },
        password: {
          isValid: false,
          message: "",
        },
        agree: {
          isValid: false,
          message: "",
        },
      },
    };
  },
  methods: {
    registerUser() {
      this.validateName();
      this.validateSurname();
      this.validateEmail();
      this.validatePhoneNumber();
      this.validatePassword();
      this.validateAgree();
      if (
        this.validation.name.isValid &&
        this.validation.surname.isValid &&
        this.validation.email.isValid &&
        this.validation.password.isValid &&
        this.validation.phoneNumber.isValid &&
        this.validation.agree.isValid
      ) {
        this.$api
          .post("/user/register", {
            name: this.name,
            surname: this.surname,
            email: this.email,
            phone: this.phoneNumber,
            password: this.password,
          })
          .then((response) => {
            this.$router.push("/verification");
          })
          .catch((error) => {
            this.$toast.error("Error");
          });
      }
    },
    validateName() {
      if (!this.name.length) {
        this.validation.name.isValid = false;
        this.validation.name.message = "To pole jest obowiązkowe.";
      } else {
        this.validation.name.isValid = true;
        this.validation.name.message = "";
      }
    },
    validateSurname() {
      if (!this.name.length) {
        this.validation.surname.isValid = false;
        this.validation.surname.message = "To pole jest obowiązkowe.";
      } else {
        this.validation.surname.isValid = true;
        this.validation.surname.message = "";
      }
    },
    validateEmail() {
      if (!this.email.length) {
        this.validation.email.isValid = false;
        this.validation.email.message = "To pole jest obowiązkowe.";
      } else if (
        !this.email.match(
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        )
      ) {
        this.validation.email.isValid = false;
        this.validation.email.message = "Wprowadź prawidłowy email.";
      } else {
        this.validation.email.isValid = true;
        this.validation.email.message = "";
      }
    },
    validatePhoneNumber() {
      const validationRegex =
        /^(?:[+]48?\d{9}$)/;
      if (!this.phoneNumber.length) {
        this.validation.phoneNumber.isValid = false;
        this.validation.phoneNumber.message = "To pole jest obowiązkowe.";
      } else if (!this.phoneNumber.match(validationRegex)) {
        this.validation.phoneNumber.isValid = false;
        this.validation.phoneNumber.message = "Nieprawidłowy nr telefonu.";
      } else {
        this.validation.phoneNumber.isValid = true;
        this.validation.phoneNumber.message = "";
      }
    },

    validatePassword() {
      if (!this.password.length) {
        this.validation.password.isValid = false;
        this.validation.password.message = "To pole jest obowiązkowe.";
      } else if (this.password.length < 7) {
        this.validation.password.isValid = false;
        this.validation.password.message = "Minimum 7 znaków.";
      } else {
        this.validation.password.isValid = true;
        this.validation.password.message = "";
      }
    },

    validateAgree() {
      if (!this.agree) {
        this.validation.agree.isValid = false;
        this.validation.agree.message = "Zaakceptuj politykę prywatności.";
      } else {
        this.validation.agree.isValid = true;
        this.validation.agree.message = "";
      }
    },
    switchVisibility() {
      this.passwordFieldType =
        this.passwordFieldType === "password" ? "text" : "password";
    },
  },
};
</script>
<style scoped>
body,
html {
  overflow-x: hidden;
}
.page-opacity {
  background-color: rgba(0, 0, 0, 0.6);
}
a {
  text-decoration: none;
  color: white;
}
</style>
