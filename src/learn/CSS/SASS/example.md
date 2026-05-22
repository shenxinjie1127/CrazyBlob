# 常见案例

## 响应式设计

```scss

@mixin flex($layout) {
  display: flex;
  justify-content: $layout;
  align-items: $layout;
}

$breakPoints: (
'phone': (320px, 480px),
'pad': (481px, 768px),
'notebook': (769px, 1024px),
'desktop': (1025px, 1200px),
'tv': 1210px,
);

@mixin respond-to($breakName) {
  $bp: map-get($breakPoints,$breakName);
  @if(type-of($bp) == 'list') {
    $min :nth($bp, 1);
    $max :nth($bp, 1);
    @media(min-width: $min) and (max-width: $max) {
      @content
    }
  } @else {
    @media (min-width: $bp) {
      @content
    }
  }
}

.header {
  display: flex;
  width: 100%;
  @include flexCenter(start);
  @include respond-to('phone') {
    height: 40px;
  };
  @include respond-to('pad');
  
}


```

## 主题切换

```scss
$themes: (

  light: (
    bgColor: #fff, 
    textColor: #000
  ),
        
        dark: (
                bgColor: #fff,
                textColor: #000
)
);


$curTheme: light;

@mixin useTheme() {
  @each $key, $value in $themes {
    $curTheme: $key !global;
    html[data-theme=#{$key}] & {
      @content
    }
  }
}


@function getVar($key) {
  $themeMap :map-get($themes, $curTheme);
  @return map-get($themeMap, $key)
};
.aa {
  width: 100px;
  @include useTheme() {
    background: getVar('bgColor');
    color: getVar('textColor')
  }
}
```

### 多个状态的使用 继承

```scss
%tip {
  margin: 1em 0;
  font-size: 0.8em;
}

.tip-warning {
  @extend $tip;
  color: orange;
}

.tip-error {
  @extend $tip;
  color: red;
}
```

