import { defineStore } from 'pinia'

const youtube = require("./yotube");

export const useSearchStore = defineStore('searchStore', {

  state: () => ({
    keyword: '',
    items: [],
    nextPage: null,
  }),

  getters: {

  },

  actions: {

    async search(){
      youtube.GetListByKeyword(this.keyword, false, 20, [{ type: "video" }])
      .then((res) => {
        this.addData(res);
      });
    },

    addData(res){
      this.nextPage = res.nextPage;
      console.log(res.nextPage);
      this.items.length = 0;

        for(let i = 0; i < res.items.length; i++){
          this.items.push({
            type: 'divider'
          });

          this.items.push({
            prependAvatar: res.items[i].thumbnail.thumbnails[0].url,
            title:  res.items[i].title,
            subtitle:  res.items[i].channelTitle,
            value: res.items[i].id,
          });
        }     
    },

    // async infiniteHandler($state) {
    //   console.log(this.nextPage);
    //   youtube
    //   .NextPage(this.nextPage, false, 2)
    //   .then((result) => {
    //     this.addData(result);
    //     $state.loaded();
    //   });
    // },

    async download(id){


    }
  }
})
