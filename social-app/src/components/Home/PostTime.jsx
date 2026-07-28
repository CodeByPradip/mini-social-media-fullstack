import { StyleSheet, Text } from "react-native";

import useCurrentTime from "../../hooks/useCurrentTime";
import React from "react";
import { COLORS, FONT_SIZE } from "../../constants/colors";
import { moderateScale } from "react-native-size-matters";
import { formatePostDate } from "../../utils/formateLastSeen";

const PostTime = ({ createdAt }) => {
  useCurrentTime();

  return <Text style={styles.postHour}>{formatePostDate(createdAt)}</Text>;
};

export default React.memo(PostTime);

const styles = StyleSheet.create({
  postHour: {
    color: COLORS.textSecondary,
    fontSize: moderateScale(FONT_SIZE.sm),
    fontWeight: "200",
  },
});
