module.exports = {
  colors: {
    neutral: {
      use_hue_curve: false,
      hue_curve: {
        start: 0.6069363983408199,
        mid: 0.6069363983408199,
        end: 0.6069363983408199,
        controls: [
          { x: 0, y: 0.15 },
          { x: 0, y: -0.15 },
          { x: 0, y: 0.15 },
          { x: 0, y: -0.15 }
        ]
      },
      saturation_curve: {
        start: 0,
        mid: 0.05202315293319341,
        end: 0.18304431061072346,
        controls: [
          { x: 0, y: 0.15 },
          { x: 0, y: -0.15 },
          { x: 0, y: 0.15 },
          { x: -0.09826588203956789, y: -0.10762870339840269 }
        ]
      },
      value_curve: {
        start: 1,
        mid: 0.49132946532352084,
        end: 0,
        controls: [
          { x: -0.0867051997629743, y: 0.15769509676909116 },
          { x: 0.12207770012476794, y: -0.08716097252926477 },
          { x: -0.18304434736117775, y: 0.13068990745794606 },
          { x: 0.11560693301729903, y: -0.18277345976273618 }
        ]
      },
      start: 0,
      end: 1000,
      steps: 41
    },
    white: 'neutral.0',
    black: 'neutral.1000',
    primary: {
      use_hue_curve: false,
      hue_curve: {
        start: 0.5876685761712701,
        mid: 0.5876685761712701,
        end: 0.5876685761712701,
        controls: [
          { x: 0, y: 0.15 },
          { x: 0, y: -0.15 },
          { x: 0, y: 0.15 },
          { x: 0, y: -0.15 }
        ]
      },
      saturation_curve: {
        start: 0,
        mid: 1,
        end: 1,
        controls: [
          { x: 0, y: 0.15 },
          { x: 0, y: -0.15 },
          { x: 0, y: 0.15 },
          { x: 0, y: -0.15 }
        ]
      },
      value_curve: {
        start: 1,
        mid: 1,
        end: 0,
        controls: [
          { x: 0, y: 0.15 },
          { x: 0, y: -0.15 },
          { x: 0, y: 0.15 },
          { x: 0, y: -0.15 }
        ]
      },
      start: 0,
      end: 1000,
      steps: 21
    }
  },
  settings: {
    open_button: false,
    float_panel: false,
    include_current: true,
    include_transparent: true,
    include_inherit: true
  }
}