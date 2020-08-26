<template>
  <div class="user-wrapper">

    <div class="content-box">
      <span class="action">
        <FullScreen v-model="fullscreen"></FullScreen>
      </span>

      <notice-icon class="action" :count="messageCount" :messages="messages" @click="handleMessageView"/>

      <a-dropdown>
        <span class="action ant-dropdown-link user-dropdown-menu">
          <a-avatar class="avatar" size="small" :src="avatar()"/>
          <span>{{ nickname() }}</span>
        </span>
        <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
          <a-menu-item key="0">
            <router-link :to="{ name: 'accountBaseSettings' }">
              <a-icon type="user"/>
              <span>个人中心</span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="1">
            <router-link :to="{ name: 'accountPassword' }">
              <a-icon type="setting"/>
              <span>修改密码</span>
            </router-link>
          </a-menu-item>
          <a-menu-divider/>
          <a-menu-item key="3">
            <a href="javascript:;" @click="handleLogout">
              <a-icon type="logout"/>
              <span>退出登录</span>
            </a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
  </div>
</template>

<script>
import NoticeIcon from '@/components/NoticeIcon'
import FullScreen from './FullScreen'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'UserMenu',
  components: {
    NoticeIcon,
    FullScreen
  },
  data () {
    return {
      visible: false,
      fullscreen: true,
      messages: this.$store.getters.messages,
      shop: this.$store.getters.shop,
      merchants: []
    }
  },
  computed: {
    messageCount () {
      return this.$store.getters.messageCount
    }
  },
  methods: {
    ...mapActions(['Logout', 'UserMessageView']),
    ...mapGetters(['nickname', 'avatar']),
    handleFullscreen () {
      this.fullscreen = !this.fullscreen
    },
    handleMessageView () {
      const id = []
      this.$store.getters.messages.map(res => {
        if (res.status == 0) {
          id.push(res.id)
        }
      })

      if (id.length > 0) {
        this.UserMessageView(id)
      }
    },
    handleClick (item) {
      this.shop = item
    },
    handleLogout () {
      const that = this

      this.$confirm({
        title: '提示',
        content: '真的要注销登录吗 ?',
        onOk () {
          return that.Logout({}).then(() => {
            window.location.reload()
          }).catch(err => {
            that.$message.error({
              title: '错误',
              description: err.message
            })
          })
        },
        onCancel () {
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .item-group {
    padding: 20px 0 8px 24px;
    font-size: 0;
    a {
      color: rgba(0, 0, 0, 0.65);
      display: inline-block;
      font-size: 14px;
      margin-bottom: 13px;
      width: 25%;
    }
    .selected {
      color: red;
    }
  }
</style>
