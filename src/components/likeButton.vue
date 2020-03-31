<template>
    <div class="btn-like" @click="handleClick">
        <van-icon class="icn-like" :class="{active:active}" :name="active ? 'like' : 'like-o'" />
    </div>
</template>

<script>
export default {
    props: {
        active: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        handleClick() {
            this.$emit('change', this.active);
        }
    }
}
</script>

<style scoped>
.btn-like {
    position: absolute;
    top: 0;
    right: 25px;
}
.icn-like {
    color: #fff;
    font-size: 22px;
    line-height: 30px;
}
.icn-like.active {
    color: rgb(189, 57, 57);
}
</style>