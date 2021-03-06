<template lang="pug">
  v-dialog(:value="value" @input="v => $emit('input', v)")
    v-card
      v-card-title.headline チャットパレット
      v-tabs(dark v-model="tab")
        //- v-tabs-bar
        //-   v-tabs-item(v-for="(tab, i) in tabs" :key="i" :href="`#chat-palette-${i}`") {{i}}
        //-   v-tabs-slider
        v-tabs-items
          v-tabs-content(v-for="(tab, i) in tabs" :key="i" :id="`chat-palette-${i}`")
            v-container(v-if="edit")
              v-text-field(
                multi-line
                :value="tabs[i].palette.join('\\n')"
                @input="v => update(i, v)"
              )
            v-list(v-else)
              v-list-tile(
                v-for="(line, j) in tab.palette"
                :key="j"
                @click="itemClick(i, j)"
              )
                v-list-tile-content
                  v-list-tile-title {{line}}
                transition(name="slide-rr")
                  v-list-tile-action(v-if="isSelected(i, j)")
                    v-icon(primary @click.stop="send(i, line)") send
      v-card-actions
        v-btn(primary v-if="edit" @click="edit = false") 編集終了
        v-btn(primary v-else @click="edit = true") 編集
        v-spacer
        v-btn(@click.stop="$emit('input', false)") 閉じる
</template>

<script>
import Palette from 'google-material-color';
import _ from 'lodash';
import { mapActions, mapState } from 'vuex';
import localStorage from '../utilities/localStorage';

function getStorageKey(roomId) {
  return `nekotaku:chat-palette:${roomId}`;
}

const InitialData = [
  {
    palette: [
      '2D6+{器用度ボーナス} 命中判定!',
      '2D6+{敏捷度ボーナス} 回避判定!',
      '//器用度ボーナス=2',
      '//敏捷度ボーナス=3',
    ],
  },
];

const saveTabs = _.debounce(
  (roomId, tabs) => localStorage.setItem(getStorageKey(roomId), JSON.stringify(tabs)),
  1000,
);

export default {
  computed: {
    ...mapState([
      'chatControl',
      'room',
    ]),
    color() {
      return Palette.get(...this.chatControl.color) || Palette.get(this.chatControl.color[0]);
    },
    name() {
      return this.chatControl.name;
    },
  },
  data() {
    return {
      tabs: [],
      tab: 'chat-palette-0',
      selectedTab: null,
      selectedLine: null,
      edit: false,
    };
  },
  methods: {
    ...mapActions([
      'sendMessage',
    ]),
    isSelected(tab, line) {
      return this.selectedTab === tab && this.selectedLine === line;
    },
    itemClick(tab, line) {
      if (this.isSelected(tab, line)) {
        this.selectedTab = null;
        this.selectedLine = null;
      } else {
        this.selectedTab = tab;
        this.selectedLine = line;
      }
    },
    update(tab, text) {
      this.tabs[tab].palette = text.split(/\n/g);
      saveTabs(this.room.id, this.tabs);
    },
    send(tab, line) {
      const {
        color,
        name,
      } = this;

      const { palette } = this.tabs[tab];
      const attrs = _(palette)
        .map(l => l.match(/^[/／][/／](.+)=([-+]?[0-9]+)$/))
        .filter(m => m)
        .map(m => [`{${m[1]}}`, m[2]]);
      const body = attrs.reduce((prev, curr) => prev.replace(curr[0], curr[1]), line);

      this.sendMessage({
        body,
        color,
        face: 'default',
        name,
      });
    },
  },
  props: {
    value: {
      type: Boolean,
      required: true,
    },
  },
  created() {
    const data = localStorage.getItem(getStorageKey(this.room.id));
    this.tabs = data ? JSON.parse(data) : InitialData;
  },
};
</script>
