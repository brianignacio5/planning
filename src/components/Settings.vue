<template>
  <div id="settings">
    <form>
      <span v-if="errors.length" class="alert">
        <b>Please fix the following errors</b>
        <ul>
          <li v-for="error in errors" :key="error">{{ error }}</li>
        </ul>
      </span>
      <label for="useremail">Email</label>
      <input
        type="email"
        name="name"
        id="useremail"
        v-model="userInfo.email"
        @keyup="clearErrors"
        placeholder="Enter user email"
        :class="{ error: userInfoFieldErrors.email }"
      />
      <label for="username">Name</label>
      <input
        type="text"
        name="name"
        id="username"
        v-model="userInfo.name"
        @keyup="clearErrors"
        placeholder="Enter the user name"
        :class="{ error: userInfoFieldErrors.name }"
      />
      <label for="userpicture">Picture</label>
      <input
        :class="{ error: userInfoFieldErrors.picture }"
        type="text"
        name="userpicture"
        id="userpicture"
        placeholder="Enter picture URL"
        v-model="userInfo.picture"
        @keyup="clearErrors"
      />
      <label for="oldpassword">Old password</label>
      <input
        :class="{ error: userInfoFieldErrors.oldPassword }"
        type="password"
        name="oldpassword"
        id="oldpassword"
        placeholder="Enter old password"
        v-model="userInfo.oldPassword"
        @keyup="clearErrors"
      />
      <label for="newpassword">New password</label>
      <input
        :class="{ error: userInfoFieldErrors.newPassword }"
        type="password"
        name="newpassword"
        id="newpassword"
        placeholder="Enter new password"
        v-model="userInfo.newPassword"
        @keyup="clearErrors"
      />
      <label for="newnewpassword">Confirm new password</label>
      <input
        :class="{ error: userInfoFieldErrors.newNewPassword }"
        type="password"
        name="newnewpassword"
        id="newnewpassword"
        placeholder="Confirm new password"
        v-model="userInfo.newNewPassword"
        @keyup="clearErrors"
      />
      <button @click="saveChanges">Save changes</button>
    </form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Action, Mutation, State } from "vuex-class";
import { user, userInfo } from "@/board";

@Component
export default class Settings extends Vue {
  @Action updateUserInfo;
  @State("myUser") storeMyUser: user;
  @State("settingsError") storeSettingsError: string[];
  @Mutation setSettingsError;
  @Mutation clearSettingsError;
  @Mutation setUser;
  private userInfo: userInfo = {
    email: "",
    name: "",
    password: undefined,
    picture: "",
    oldPassword: undefined,
    newPassword: undefined,
    newNewPassword: undefined
  };
  private userInfoFieldErrors = {
    email: false,
    name: false,
    password: false,
    picture: false,
    oldPassword: false,
    newPassword: false,
    newNewPassword: false
  };

  get errors() {
    return this.storeSettingsError;
  }

  clearErrors() {
    this.clearSettingsError();
    this.userInfoFieldErrors = {
      email: false,
      name: false,
      password: false,
      picture: false,
      oldPassword: false,
      newPassword: false,
      newNewPassword: false
    };
  }

  saveChanges(e) {
    e.preventDefault();
    this.clearSettingsError();
    if (!this.userInfo.email) {
      this.setSettingsError("Email is required");
      this.userInfoFieldErrors.email = true;
    }
    if (this.userInfo.newPassword && !this.userInfo.oldPassword) {
      this.setSettingsError("Please input the old password");
      this.userInfoFieldErrors.oldPassword = true;
    }
    if (
      this.userInfo.newPassword &&
      this.userInfo.newPassword !== this.userInfo.newNewPassword
    ) {
      this.setSettingsError("New password and confirmation doesn't match");
      this.userInfoFieldErrors.newPassword = true;
      this.userInfoFieldErrors.newNewPassword = true;
    } else {
      this.userInfo.password = this.userInfo.newPassword;
    }
    if (this.errors.length < 1) {
      const newUser = this.storeMyUser;
      newUser.email = this.userInfo.email;
      newUser.picture = this.userInfo.picture;
      newUser.name = this.userInfo.name;
      this.setUser(newUser);
      this.updateUserInfo(this.userInfo);
    }
  }

  mounted() {
    const newUserData = this.$cookies.get("planningJwt");
    if (newUserData) {
      const newUser = {
        name: newUserData.name,
        email: newUserData.email,
        picture: newUserData.picture,
        token: newUserData.token
      };
      this.setUser(newUser);
      this.userInfo = {
        email: newUserData.email,
        name: newUserData.name,
        password: undefined,
        picture: newUserData.picture,
        oldPassword: undefined,
        newPassword: undefined,
        newNewPassword: undefined
      };
    }
  }
}
</script>

<style scoped>
#settings form {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0.5em;
}

#settings form input {
  padding: 0.5rem;
  border: 0;
  box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.5);
  margin: 1rem;
  width: 60%;
}

#settings form input.error {
  background-color: #fce4e4;
  border: 1px solid #ea5151;
  outline: none;
}

#settings form button {
  border-radius: 5px;
  padding: 0.5em;
  margin: 0.5em;
}

#settings form button:hover {
  color: #ea5151;
  border: 0.25em solid #ea5151;
}

.alert {
  padding: 20px;
  background-color: #ea5151;
  color: white;
  margin-bottom: 15px;
}
</style>