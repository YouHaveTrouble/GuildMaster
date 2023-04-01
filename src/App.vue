</script>

<style lang="scss" scoped>
  header {
    position: relative;
    height: 8rem;
    background-color: rgba(87, 50, 20, 0.75) url(/img/background/panels/plaster.png) repeat;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }
  nav {
    width: max-content;
    text-align: center;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
    padding: 2rem;
    background-size: 200px;
    background-blend-mode: darken;
    background-color: rgba(0, 0, 0, 0.65);
    &:hover {
      transform: translateY(-0.2rem);
    }
    .icon {
      width: 2rem;
      height: 2rem;
      fill: white;
      filter: invert(1);
      transform: translateY(0.35rem);
      transition: transform 0.3s ease-in-out;
    }
    a {
      font-size: 2rem;
      color: #fff;
      text-decoration: none;
      transition: color 0.3s ease-in-out;
      &.router-link-active {
        text-decoration: underline;
      }
      &:hover {
        color: #f1c40f;
      }
    }
  }
</style>
