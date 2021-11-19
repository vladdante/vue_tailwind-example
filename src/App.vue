<template>
  <div id="app" :class="theme" class="flex h-screen overflow-hidden
                                      bg-orange-light dark:bg-gray-800"
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
          <input type="checkbox"
                 id="toggle"
                 v-model="isDark"
                 class="sr-only"
          >
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
                                   items-center mt-44
                                   text-gray-700 dark:text-gray-200 text-4xl font-bold"
      >
        <img :src="getModePath('github-alt.svg')" class="h-44 mb-7 animate-bounce">
        LOADING
      </div>

      <div v-if="!isLoading && repositories.length"
           class="w-11/12 md:w-1/3
                  mt-5 md:mt-5
                  mb-5"
      >
        <div v-for="repository in repositories"
             :key="repository"
             class="grid
                    grid-cols-6 md:grid-cols-12
                    p-5 mb-5
                    bg-orange-pale shadow-lg
                    dark:bg-gray-700
                    rounded-lg"
        >
          <img :src="repository.owner.avatar_url" class="rounded-full
                                                         h-8 w-8 p-0
                                                         row-span-2 md:row-span-1"
          />
          <div class="text-gray-600 dark:text-gray-100
                      md:col-span-11 md:flex"
          >
            <a :href="repository.owner.html_url" class="p-0 flex items-center mr-3 col-span-5">
              <img :src="getModePath('user.svg')" class="h-4 mr-2"/>
              {{ repository.owner.login }}
            </a>
            <a :href="repository.html_url" class="p-0 flex items-center col-span-5 whitespace-nowrap">
              <img :src="getModePath('book.svg')" class="h-4 mr-2"/>
              {{ repository.name }}
            </a>
          </div>
          <div class="mt-5 mb-5
                      text-sm text-gray-600 dark:text-gray-400
                      col-span-6 md:col-span-12"
          >
            {{ repository.description }}
          </div>
          <span class="p-0 align-middle
                       text-orange
                       col-span-3 md:col-span-6"
          >
            {{ repository.language }}
          </span>
          <div class="p-0 text-gray-600 dark:text-gray-100
                      flex items-center justify-end
                      col-span-3 md:col-span-6"
          >
            <img :src="getModePath('star.svg')" class="h-3 mr-1">
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
    isDark: false
  }),
  mounted() {
    let cash = localStorage.isDark
    if (cash) {
      this.toggleTheme(cash)
    }
  },
  watch: {
    isDark (value) {
      this.toggleTheme(value)
      localStorage.isDark = value
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
    toggleTheme(value) {
      value === true ? document.querySelector("html").classList.add("dark") : document.querySelector("html").classList.remove("dark")
    },
    getModePath(icon) {
      if (this.isDark) {
        return require(`./assets/icons/dark_mode/${ icon }`)
      } else { return require(`./assets/icons/${ icon }`) }
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
  background: url("./assets/icons/moon.svg") no-repeat center
  background-size: 1.6em

::-webkit-scrollbar
  width: 17px

::-webkit-scrollbar-track
  background: transparent
  &:hover
    cursor: pointer

::-webkit-scrollbar-thumb
  background: #b2b8c0
  border: 5px solid transparent
  border-radius: 1em
  background-clip: padding-box
  &:hover
    background: #e3680a
    border: 5px solid transparent
    background-clip: padding-box
</style>
