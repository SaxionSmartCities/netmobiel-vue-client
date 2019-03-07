<template>
    <div class="container" id="progressbar">
        <div class="circle" :class="n <= currentSelected ? 'selected' : ''" :id="n" :key="n" v-for="n in numbers">{{ n
            }}
        </div>
    </div>
</template>

<script>
    export default {
        name: 'ProgressRegistrationBar',
        props: {
            currentSelected: Number
        },
        data: function () {
            return {
                numbers: [1, 2, 3, 4]
            };
        }
    }
</script>

<style lang="scss">
    #progressbar {
        display: flex;
        justify-content: space-between;
        position: relative;
    }

    #progressbar::before {
        content: '';
        position: absolute;
        top: 48%;
        left: 0;
        border-top: 2px solid #ffffff;
        left: 0;
        right: 0;
        margin: auto;
        width: 90%;
    }

    .circle {
        border-radius: 50%;
        width: 27px;
        text-align: center;
        z-index: 2;
        color: #ffffff;
        border: 2px solid #ffffff;
        background: $color-green;
    }

    .selected {
        background: #ffffff;
        color: $color-green;
    }
</style>
