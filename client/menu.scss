@import "compass/css3";

@import "compass";

/* VARIABLES */
$header-bg: #3f51b5;
$menu-width: 250px!default;

/* BASE */
html,
body {
  font-family: 'Roboto', sans-serif;
  font-size: 1em;
  line-height: 1.4;
  height: 100%;
  
  margin: 0;
  padding: 0;
}

a {
  text-decoration: none;
  color: inherit;
}

.container {
  @include clearfix;
  margin: 0 20px;
}

.site-content {
  padding-top: 66px;
}

/* HEADER */
.header {
  position: fixed;
  left: 0;
  right: 0;
  height: 66px;
  
  line-height: 66px;
  color: #fff;
  
  background-color: $header-bg;
}

.header__logo {
  font-weight: 700;
  padding: 0 25px;
  float: left;
}

/* MENU */
.menu {
  float: left;
  
  a {
    padding: 0 10px;
  }
  
  a:hover {
    color: #c5cae9;
  }
}

/* RESPONSIVE */
@media only screen and (max-width: 768px) {
  .site-pusher,
  .site-container {
    height: 100%;
  }
  
  .site-container {
    overflow: hidden;
  }
  
  .site-pusher {
    @include transition-duration(0.3s);
    @include transform(translateX(0px));
  }
  
  .site-content {
    position: absolute;
    top: 66px;
    right: 0;
    left: 0;
    bottom: 0;
    padding-top: 0;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  }
  
  .header {
    position: static;
  }
  
  .header__icon {
    position: relative;
    display: block;
    float: left;
    width: 50px;
    height: 66px;
    
    cursor: pointer;
    
    &:after {
      content: '';
      position: absolute;
      display: block;
      width: 1rem;
      height: 0;
      top: 16px;
      left: 15px;
      @include box-shadow(0 10px 0 1px #fff, 0 16px 0 1px #fff, 0 22px 0 1px #fff);
    }
  }
  
  .menu {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    background-color: darken($header-bg, 5);
/*    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;*/
    
    width: $menu-width;
    
    @include transform(translateX($menu-width * -1));
    a {
      display: block;
      height: 40px;
      
      text-align: center;
      line-height: 40px;
      
      border-bottom: 1px solid $header-bg;
    }
  }
  
  .with--sidebar {
    .site-pusher {
      @include transform(translateX($menu-width));
    }
    .site-cache {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0,0,0,0.6);
    }
  }
}