import { StyleSheet, Text } from "react-native";

import useCurrentTime from "../../../hooks/useCurrentTime";
import React from "react";
import { COLORS, FONT_SIZE } from "../../../constants/colors";
import { moderateScale } from "react-native-size-matters";
import { formatePostDate } from "../../../utils/formateLastSeen";

const CommentTime = ({ createdAt }) => {
  useCurrentTime();

  return <Text style={styles.postHour}>{formatePostDate(createdAt)}</Text>;
};

export default React.memo(CommentTime);

const styles = StyleSheet.create({
  postHour: {
    fontWeight: "200",
    marginLeft: 8,
    color: COLORS.textMuted,
  },
});
