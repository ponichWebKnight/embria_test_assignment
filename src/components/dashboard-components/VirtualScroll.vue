<template>
    <div class="vscroll-holder">
        <div
            class="vscroll-spacer"
            :style="{
                opacity: 0,
                clear: 'both',
                height: topHeight + 'px'
            }"
        ></div>
        <slot :items="visibleItems"></slot>
        <div
            class="vscroll-spacer"
            :style="{
                opacity: 0,
                clear: 'both',
                height: bottomHeight + 'px'
            }"
        ></div>
    </div>
</template>

<script>
export default {
    name: 'VirtualScroll',
    props: {
        items: Array,
        itemHeight: Number
    },
    data () {
        return {
            topHeight: 0,
            bottomHeight: 0,
            visibleItems: []
        }
    },
    mounted () {
        window.vscroll = this
        this._checkScrollPosition = this.checkScrollPosition.bind(this)
        this.checkScrollPosition()
        this.$el.addEventListener('scroll', this._checkScrollPosition)
        this.$el.addEventListener('wheel', this._checkScrollPosition)
    },
    beforeDestroy () {
        this.$el.removeEventListener('scroll', this._checkScrollPosition)
        this.$el.removeEventListener('wheel', this._checkScrollPosition)
    },
    methods: {
        checkScrollPosition (e = {}) {
            const el = this.$el

            // prevent parent scroll
            if ((el.scrollTop === 0 && e.deltaY < 0) ||
            (Math.abs(el.scrollTop - (el.scrollHeight - el.clientHeight)) <= 1 &&
                e.deltaY > 0)
            ) {
                e.preventDefault()
            }
            this.updateWindow(e)
        },

        updateWindow (e) {
            const visibleItemsCount = Math.ceil(
                (this.$el.clientHeight - this.itemHeight) / this.itemHeight
            )
            const totalScrollHeight = this.items.length * this.itemHeight

            const scrollTop = this.$el.scrollTop
            const offset = 3
            const firstVisibleIndex = Math.floor((scrollTop - this.itemHeight) / this.itemHeight)
            const lastVisibleIndex = firstVisibleIndex + visibleItemsCount
            const firstCutIndex = Math.max(firstVisibleIndex - offset, 0)
            const lastCutIndex = lastVisibleIndex + offset

            this.visibleItems = this.items.slice(firstCutIndex, lastCutIndex)
            this.topHeight = firstCutIndex * this.itemHeight
            this.bottomHeight = totalScrollHeight -
            this.visibleItems.length * this.itemHeight -
            this.topHeight
        }
    },
    watch: {
        items: function () {
            this.updateWindow()
        }
    }
}
</script>
