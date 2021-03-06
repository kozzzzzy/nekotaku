<template lang="pug">
  .map-container(
    v-if="map"
    ref="container"
    @mousedown="e => mms.onMapTouch(e)"
    @touchstart="e => mms.onMapTouch(e)"
    @touchmove="e => mms.mapMove(e)"
  )
    div.map(
      :class="{ perspective: mapControl.perspective }"
      :style="styles.map"
      @mousemove="e => mms.mapDrag(e)"
    )
      div.map-inner(:style="styles.mapInner")
        div.row(
          v-for="y in map.height"
          :v-key="y"
        )
          div.tile.text-xs-center(v-for="x in map.width", :v-key="x") {{x}}-{{y}}
        svg.layer(:width="map.width * 50", :height="map.width * 50")
          g(
            v-for="shape in shapes"
            :key="shape.id"
            @mousedown="e => mms.onShapeTouch(e, shape)"
            @touchstart="e => mms.onShapeTouch(e, shape)"
          )
            shape-entity(:shape="shape")
            shape-entity(v-if="showHolder", :shape="shape", holder)
        .layer
          .character.elevation-2(
            v-for="character in characters"
            :style="character.style"
          )
            .character-inner(
              v-tooltip:bottom="{html:character.name}"
              :style="character.innerStyle"
              @mousedown="e => mms.onCharacterTouch(e, character)"
              @touchstart="e => mms.onCharacterTouch(e, character)"
            )
              div.name.text-xs-center.caption {{character.name}}
  loading(v-else)
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import getMapModeStrategy from '../map';
import Loading from './Loading.vue';
import ShapeEntity from './ShapeEntity.vue';

export default {
  components: {
    Loading,
    ShapeEntity,
  },
  computed: {
    ...mapState([
      'map',
      'mapControl',
    ]),
    ...mapState({
      charactersState: 'characters',
      shapeState: 'shapes',
    }),
    scale() {
      return 2 ** this.mapControl.zoom;
    },
    styles() {
      return {
        map: {
          transform: `scale(${this.scale})`,
        },
        mapInner: {
          width: `${this.map.width * 50}px`,
          height: `${this.map.height * 50}px`,
          backgroundImage: `url(${this.map.backgroundImage})`,
        },
      };
    },
    characters() {
      return this.charactersState.map((character) => {
        const {
          x, y,
          icon,
        } = character;

        const iconUrl = character ? icon : null;

        return {
          ...character,
          style: {
            transform: `translate(${(x * 50) - 25}px, ${(y * 50) - 25}px)`,
          },
          innerStyle: {
            backgroundImage: iconUrl ? `url(${iconUrl})` : null,
          },
        };
      }).sort((a, b) => a.z > b.z);
    },
    shapes() {
      return this.shapeState.slice().sort((a, b) => a.z > b.z);
    },
    showHolder() {
      const {
        mode,
      } = this.mapControl;

      return mode === 'move' || mode === 'erase';
    },
    mms() {
      const {
        mode,
        shapeType,
      } = this.mapControl;

      if (!this.mmsCache || mode !== this.mmsCache.mode || shapeType !== this.mmsCache.shapeType) {
        this.mmsCache = getMapModeStrategy(this);
      }

      return this.mmsCache;
    },
  },
  data() {
    return {
      mmsCache: null,
    };
  },
  methods: {
    ...mapActions([
      'alignCharacter',
      'alignShape',
      'createShape',
      'moveCharacter',
      'moveShape',
      'removeShape',
      'updateShape',
    ]),
    ...mapMutations([
      'selectEntity',
      'deselectEntity',
    ]),
  },
  created() {
    const unsubscribers = [];

    function subscribe(event, handler) {
      const bindedHandler = e => handler(e);
      window.addEventListener(event, bindedHandler);
      unsubscribers.push(() => window.removeEventListener(event, bindedHandler));
    }

    this.unsibscribe = () => unsubscribers.forEach(f => f());

    subscribe('mousemove', e => this.mms.mapMove(e));
    subscribe('mouseup', e => this.mms.onMoveEnd(e));
    subscribe('touchend', e => this.mms.onMoveEnd(e));

    document.body.parentElement.classList.add('no-scroll');
  },
  destroyed() {
    document.body.parentElement.classList.remove('no-scroll');
    this.unsibscribe();
  },
};
</script>

<style lang="stylus">
html.no-scroll {
  overflow hidden
}
</style>

<style lang="stylus" scoped>
.map-container
  position fixed
  top 56px
  bottom 106px
  left 0
  right 0
  overflow scroll

.map
  user-select none
  padding 100px
  display inline-block

  transition transform 0.4s ease-in-out
  transform-origin top left

  transform-style preserve-3d
  perspective 1000px
  perspective-origin center center

  *
    transform-style preserve-3d

.map-inner
  transition transform 0.4s ease-in-out
  transform-origin bottom
  position relative
  background-origin content-box
  background-size 100% 100%

.row
  white-space nowrap
  height 50px

.tile
  display inline-block
  width 50px
  height 50px
  border 1px solid rgba(0, 0, 0, 0.5)
  text-align center

.layer
  position absolute
  top 0
  left 0

svg g *
  box-shadow 0 0 5px rgba(0, 0, 0, 0.5)

.character
  position absolute

  .character-inner
    width 50px
    height 50px
    background-color rgba(255, 255, 255, 0.5)
    background-size cover
    display flex
    flex-direction column
    align-items stretch
    justify-content flex-end
    border 1px solid black
    transform-origin bottom
    transition transform 0.4s ease-in-out
    transform translateZ(0.5px)

  .name
    background-color rgba(255, 255, 255, 0.5)
    text-overflow ellipsis
    white-space nowrap
    overflow hidden
    transition transform 0.4s ease-in-out

.editor
  position absolute
  top 100px
  left 100px
  right 100px
  bottom 100px

.perspective
  .map-inner
    transform rotateX(90deg)

  .character
    box-shadow none !important

    &:after
      content: ' '
      width 40px
      height 10px
      position absolute
      top 46px
      left 5px
      border-radius 50%
      background rgba(0, 0, 0, 0.6)
      box-shadow 0 0 10px rgba(0, 0, 0, 0.6)

  .character-inner
    transform rotateX(-90deg)

    background-color transparent
    border: none

  .name
    border 1px solid black
    transform translateY(-50px)
</style>
