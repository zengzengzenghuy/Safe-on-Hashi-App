import { Card, CardActions, CardContent } from "@mui/material";
const TxCard = (props: any) => {
  return (
    <Card>
      <CardContent>Hello {props}</CardContent>
    </Card>
  );
};

export default TxCard;
