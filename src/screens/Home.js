import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  Animated,
  PanResponder
} from "react-native";

import Images from "../assets/img";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;
const HEADER_HEIGHT = 60;
const FOOTER_HEIGHT = 60;

const USERS = [
  {
    id: "1",
    uri: Images.image1
  },
  {
    id: "2",
    uri: Images.image2
  },
  {
    id: "3",
    uri: Images.image3
  },
  {
    id: "4",
    uri: Images.image4
  },
  {
    id: "5",
    uri: Images.image5
  }
];

class Home extends Component {
  constructor(props) {
    super(props);

    this.position = new Animated.ValueXY();
    this.state = {
      currentIndex: 0
    };

    this.rotate = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: ["-10deg", "0deg", "10deg"],
      extrapolate: "clamp"
    });

    this.rotateAndTranslate = {
      transform: [
        {
          rotate: this.rotate
        },
        ...this.position.getTranslateTransform()
      ]
    };

    this.likeOpactity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [0, 0, 1],
      extrapolate: "clamp"
    });

    this.nopeOpactity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0, 0],
      extrapolate: "clamp"
    });

    this.nextCardOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0, 1],
      extrapolate: "clamp"
    });

    this.nextCardScale = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0.8, 1],
      extrapolate: "clamp"
    });
  }

  componentWillMount() {
    this.PanResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderMove: (evt, gestureState) => {
        this.position.setValue({ x: gestureState.dx, y: gestureState.dy });
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 120) {
          Animated.spring(this.position, {
            toValue: { x: SCREEN_WIDTH + 100, y: gestureState.dy }
          }).start(() => {
            this.setState(
              {
                currentIndex: this.state.currentIndex + 1
              },
              () => {
                this.position.setValue({ x: 0, y: 0 });
              }
            );
          });
        } else if (gestureState.dx < -120) {
          Animated.spring(this.position, {
            toValue: { x: -SCREEN_WIDTH - 100, y: gestureState.dy }
          }).start(() => {
            this.setState(
              {
                currentIndex: this.state.currentIndex + 1
              },
              () => {
                this.position.setValue({ x: 0, y: 0 });
              }
            );
          });
        } else {
          Animated.spring(this.position, {
            toValue: { x: 0, y: 0 }
          }).start();
        }
      }
    });
  }

  renderUsers = () => {
    return USERS.map((item, i) => {
      if (i < this.state.currentIndex) {
        return null;
      } else if (i === this.state.currentIndex) {
        return (
          <Animated.View
            {...this.PanResponder.panHandlers}
            key={item.id}
            style={[this.rotateAndTranslate, styles.imageArea]}
          >
            <Animated.View
              style={[styles.likeTextArea, { opacity: this.likeOpactity }]}
            >
              <Text style={styles.likeTextStyle}>Like</Text>
            </Animated.View>

            <Animated.View
              style={[styles.nopeTextArea, { opacity: this.nopeOpactity }]}
            >
              <Text style={styles.nopeTextStyle}>Nope</Text>
            </Animated.View>
            <Image resizeMode="cover" style={styles.image} source={item.uri} />
          </Animated.View>
        );
      } else {
        return (
          <Animated.View
            key={item.id}
            style={[
              styles.imageArea,
              { opacity: this.nextCardOpacity },
              { transform: [{ scale: this.nextCardScale }] }
            ]}
          >
            <Image resizeMode="cover" style={styles.image} source={item.uri} />
          </Animated.View>
        );
      }
    }).reverse();
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerStyle}>{/* <Text>Header</Text> */}</View>
        <View style={styles.imageContainer}>
          {/* <Animated.View style={styles.imageArea}>
            <Image
              resizeMode="cover"
              style={styles.image}
              source={USERS[0].uri}
            />
          </Animated.View> */}
          {this.renderUsers()}
        </View>
        <View style={styles.footerStyle}>{/* <Text>Footer</Text> */}</View>
      </View>
    );
  }
}
export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerStyle: {
    height: HEADER_HEIGHT
  },
  footerStyle: {
    height: FOOTER_HEIGHT
  },
  imageContainer: {
    flex: 1
  },
  imageArea: {
    height: SCREEN_HEIGHT - 120,
    width: SCREEN_WIDTH,
    padding: 10,
    position: "absolute"
  },
  image: {
    height: null,
    width: null,
    flex: 1,
    borderRadius: 20
  },
  likeTextArea: {
    position: "absolute",
    top: 50,
    left: 40,
    zIndex: 10,
    transform: [
      {
        rotate: "-30deg"
      }
    ]
  },
  likeTextStyle: {
    borderWidth: 1,
    borderColor: "green",
    color: "green",
    fontSize: 32,
    fontWeight: "800",
    padding: 10
  },
  nopeTextArea: {
    position: "absolute",
    top: 50,
    right: 40,
    zIndex: 10,
    transform: [
      {
        rotate: "30deg"
      }
    ]
  },
  nopeTextStyle: {
    borderWidth: 1,
    borderColor: "red",
    color: "red",
    fontSize: 32,
    fontWeight: "800",
    padding: 10
  }
});
