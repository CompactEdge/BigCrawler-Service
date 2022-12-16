import React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import { Icon } from '@mui/material';


const logSample = `
You haven added your Slack yet or you arent authorized. Please add our
Slack Bot to your account by clicking on here. When youve added the bot, send your
verification code that you have received.
You haven added your Slack yet or you arent authorized. Please add our
Slack Bot to your account by clicking on here. When youve added the bot, send your
verification code that you have received.
You haven added your Slack yet or you arent authorized. Please add our
Slack Bot to your account by clicking on here. When youve added the bot, send your
verification code that you have received.
You haven added your Slack yet or you arent authorized. Please add our
Slack Bot to your account by clicking on here. When you&apos;ve added the bot, send your
verification code that you have received.
You haven added your Slack yet or you arent authorized. Please add our
Slack Bot to your account by clicking on here. When you&apos;ve added the bot, send your
verification code that you have received.
You haven added your Slack yet or you arent authorized. Please add our
Slack Bot to your account by clicking on here. When youve added the bot, send your
verification code that you have received.
You haven added your Slack yet or you arent authorized. Please add our
Slack Bot to your account by clicking on here. When youve added the bot, send your
verification code that you have received.
You haven added your Slack yet or you arent authorized. Please add our
Slack Bot to your account by clicking on here. When youve added the bot, send your
verification code that you have received.
`;

function LogBox(props) {
  const [open, setOpen] = React.useState(true);
  const [logText, setLogText] = React.useState(logSample);

  const scrollRef = React.useRef();

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    };
  };

  // React.useEffect(() => {
  // }, []);

  React.useEffect(() => {
    scrollToBottom();
  }, [logText]);

  return (
    <MDBox>
      <Box sx={{ width: '100%' }}>
        <MDButton
          variant="gradient" color={open ? "dark" : "light"} size="small"
          onClick={() => {
            if (open) {
              setOpen(false);
            } else {
              setOpen(true);
            };
          }}
        >
          {open ? <>hide log &nbsp;<Icon>expand_less</Icon></> : <>show log &nbsp;<Icon>expand_more</Icon></>}
        </MDButton>
        <Collapse in={open}>
          <MDBox
            mt={1}
            py={2}
            bgColor={"grey-200"}
            borderRadius="lg"
          >
            <MDBox
              px={2}
              height="130px"
              overflow="auto"
              ref={scrollRef}
            >
              <MDTypography fontSize="14px" fontWeight="medium" color="text">
                {logText}
              </MDTypography>
            </MDBox>
          </MDBox>
        </Collapse>
      </Box>
    </MDBox>
  );
}

export default LogBox;