<template>
  <div id="app" :class="theme" class="flex h-screen overflow-hidden
                                      bg-yellow-50 dark:bg-gray-800"
  >
    <div class="grid gap-5
                grid-cols-2 md:grid-cols-3
                grid-rows-2 md:grid-rows-1
                fixed w-full
                bg-gray-900 p-5 shadow-2xl"
    >
      <div class="flex
                  justify-start items-center
                  text-3xl text-white
                  place-content-center"
      >
        <img src="./assets/icons/github.svg" class="h-8 mr-2"/>
        <b>GitHub</b>Search
      </div>

      <label for="toggle" class="flex
                                 justify-end items-center md:order-last
                                 cursor-pointer"
      >
        <div class="relative">
          <input type="checkbox" id="toggle" class="sr-only" @click="toggleTheme">
          <div class="block
                      h-8 md:h-11 w-14 md:w-20
                      bg-gray-700 rounded-lg"
          />
          <div class="dot
                      absolute
                      h-6 md:h-8 w-6 md:w-8
                      left-1 md:left-1.5 top-1 md:top-1.5
                      transition"
          />
        </div>
      </label>

      <div class="flex relative
                  w-full align-middle
                  col-span-2 md:col-span-1"
      >
        <input type="text"
               v-model="search"
               @keyup.stop="getRepositories"
               placeholder="Let's search some repositories!"
               class="w-full pl-2 rounded-md
                      bg-gray-700 text-white
                      border border-transparent
                      focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent"
        >
        <button v-if="search.length" @click="clear" class="absolute right-3 top-1.5">
          <img src="./assets/icons/times.svg" class="h-7">
        </button>
      </div>
    </div>

    <div class="flex w-full overflow-y-auto
                justify-center
                mt-36 md:mt-20"
    >
      <div v-if="isLoading" class="flex flex-col
                                   text-gray-700 text-4xl font-bold
                                   items-center mt-44"
      >
        <img src="./assets/icons/github-alt.svg" class="h-44 mb-7 animate-bounce">
        LOADING
      </div>

      <div v-if="!isLoading && repositories.length"
           class="w-4/5 md:w-1/3
                  mt-5 md:mt-5
                  mb-5"
      >
        <div v-for="repository in repositories"
             :key="repository"
             class="grid
                    grid-cols-2 md:grid-cols-3
                    p-5 mb-5
                    bg-gray-100 shadow-lg rounded-lg"
        >
          <img :src="repository.owner.avatar_url" class="rounded-full
                                                         h-8 w-8 p-0
                                                         row-span-2 md:row-span-1"
          />
          <a :href="repository.owner.html_url" class="p-0 flex items-center">
            <img src="./assets/icons/user.svg" class="h-4 mr-2"/>
            {{ repository.owner.login }}
            <span class="invisible md:visible ml-2">/</span>
          </a>
          <a :href="repository.html_url" class="p-0 flex items-center">
            <img src="./assets/icons/book.svg" class="h-4 mr-2"/>
            {{ repository.name }}
          </a>
          <div class="mt-5 mb-5
                      text-sm text-gray-900
                      col-span-2 md:col-span-3"
          >
            {{ repository.description }}
          </div>
          <span class="p-0 text-orange align-middle">{{ repository.language }}</span>
          <div class="p-0
                      flex items-center justify-end
                      col-span-1 md:col-span-2"
          >
            <img src="./assets/icons/star.svg" class="h-3 mr-1">
            {{ repository.stargazers_count }}
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import Axios from "axios"

export default {
  name: "App",
  data: () => ({
    repositories: [],
    search: "",
    isLoading: false,
    theme: localStorage.getItem("theme")
  }),
  beforeMount() {
    const cachedTheme = localStorage.theme ? localStorage.theme : false
    const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (cachedTheme)
      localStorage.theme = cachedTheme
    else if (userPrefersDark)
      localStorage.theme = "dark"
    else
      localStorage.theme = "light"
  },
  watch: {
    theme(newTheme) {
      newTheme === "light"
        ? document.querySelector("html").classList.remove("dark")
        : document.querySelector("html").classList.add("dark")
    }
  },
  methods: {
    getRepositories() {
      if (this.search) {
        this.isLoading = true
        Axios
          .get(`https://api.github.com/search/repositories?q=${ this.search }+in%3Aname&sort=stars`)
          .then((response) => {
            this.repositories = response.data.items
            this.isLoading = false
          })
          .catch(error => console.log(error))
      } else {
        this.repositories = []
      }
    },
    clear() {
      this.isLoading = false
      this.search = ""
      this.repositories = []
    },
    toggleTheme() {
      console.log("TOGGLE")
      switch (localStorage.theme) {
        case "light": localStorage.theme = "dark"; break
        default: localStorage.theme = "light"; break
      }
    }
  }
}
</script>

<style lang="sass">
.dot
  background: url("./assets/icons/sun.svg") no-repeat center
  background-size: 1.6em
input[type="checkbox"]:checked ~ .dot
  transform: translateX(100%)
  //background-color: #48bb78
  background: url("./assets/icons/moon.svg") no-repeat center
  background-size: 1.6em
</style>
