<template>
    <div>
        <div class="loading__mask">
            <div class="loading__wrapper">
                <van-loading color="#15c6a3"></van-loading>
                <div class="loading__title">一个偶像派歌手正在调试麦克风...</div>
            </div>
        </div>
    </div>
</template>
    
<script>
export default {
    data() {
        return {
            
        };
    },
    methods: {
        
    }
}
</script>
    
<style scoped>
.loading__mask {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 999;
    background: rgba(0,0,0,0.5);
}
.loading__wrapper {
    background: #fff;
    padding: 14px 12px;
    border-radius: 4px;
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.loading__title {
    font-size: 13px;
    margin-top: 10px;
    color: #999;
}
</style>