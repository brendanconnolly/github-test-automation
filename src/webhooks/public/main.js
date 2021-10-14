Vue.component("webhooks-list", {
  props: {},
  template: `
     <div class="webhook-list">
        <section>

        <b-collapse
            class="card"
            animation="slide"
            v-for="(hook, index) of webhooks"
            :key="index"
            :open="isOpen == index"
            @open="isOpen = index">
            <template #trigger="props">
                <div
                    class="card-header"
                    role="button"
                >
                    <p class="card-header-title">
                        Received - {{ new Date(hook.recievedAt).toDateString() }} @ {{ new Date(hook.recievedAt).toLocaleTimeString() }}
                    </p>
                    <a class="card-header-icon">
                        <b-icon
                            :icon="props.open ? 'menu-down' : 'menu-up'">
                        </b-icon>
                    </a>
                </div>
            </template>
            <div class="card-content">
                <div class="content">
                    <pre>{{ hook.body }}</pre>
                </div>
            </div>
        </b-collapse>

        </section>
     </div>
     `,
  data() {
    return {
      isOpen: 0,
      webhooks: [],
    };
  },
  mounted() {
    axios.get("http://localhost:3005/hooks").then((response) => {
      this.webhooks = response.data;
    });
  },
  methods: {},
  computed: {},
});

var app = new Vue({
  el: "#app",
  data: {},
});
