import React, { useEffect } from "react";
import { Form, Formik } from "formik";
import formHandler from "@/app/common/utils/formHandler";
import authService from "@/app/services/authService";
import InputField from "@/app/components/forminputs/InputField";
import { useSession } from "@/app/common/context/sessionContext";
import { LoggedInUserDto } from "@/app/common/dtos/LoggedInUserDto";
import { NextRouter, useRouter } from "next/router";
import GuestLayout from "@/app/components/layout/GuestLayout";
import ButtonSubmit from "@/app/components/forminputs/ButtonSubmit";
import bannerNotification from "@/app/services/bannerNotificationService";
import Button  from "react-bootstrap/button";
import { ExternalLoginType } from "@/app/common/enums/ExternalLoginType";
import authUtils from "@/app/common/utils/authUtils";
import buttonHandler from "@/app/common/utils/buttonHandler";
import bannerNotificationService from "@/app/services/bannerNotificationService";
import { GetServerSidePropsContext } from "next";
import cn from "classnames";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      appBaseUrl: process.env.APP_BASE_URL,
    },
  };
}

interface serverSideProps {
  appBaseUrl: string;
  apiBase: string;
}

const Login = (props: serverSideProps) => {
  const { setUser } = useSession();
  const router = useRouter();

  // useEffect(() => {
  //   console.log('logging router query' + query.failure_message);
  //   if (query.failure_message) {
  //     bannerNotificationService.error(query.failure_message);
  //   }
  // }, []);

  useEffect(() => {
    if (!router.isReady) return;
    console.log("logging router query" + router.query.failure_message);
    if (router.query.failure_message) {
      bannerNotificationService.error(router.query.failure_message);
    }

    // codes using router.query
  }, [router.isReady]);

  return (
    <GuestLayout>
      <div className="text-center">
        <img src='/images/Castled-Logo.png' alt="Castled Logo" className="my-3"/>
        <h2>Sign in</h2>
        <p className="text-muted">to continue to Castled</p>
      </div>
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        onSubmit={formHandler(
          false,
          {
            id: "login_form",
            pickFieldsForEvent: ["email"],
          },
          authService.login,
          () => handleLogin(setUser, router)
        )}
      >
        <Form>
          <InputField
            type="email"
            name="email"
            title="Email"
            placeholder="Enter email"
          />
          <InputField
            type="password"
            name="password"
            title="Password"
            placeholder="Enter password"
          />
          <ButtonSubmit className="form-control btn-lg" />
        </Form>
      </Formik>
      <div className="mt-3 d-flex flex-row align-items-center">
        <p className="horizontal-line">
          <span> or </span>{" "}
        </p>
      </div>
      <div className="my-3 gap-2 text-center">
        <Button
          className="d-block btn-lg login-with-google"
          href={authUtils.getExternalLoginUrl(
            props.appBaseUrl,
            ExternalLoginType.GOOGLE,
            router.pathname
          )}
          onClick={buttonHandler(false, { id: "login_with_google" })}
          variant="outline-secondary"
        >
          <img src="/images/google.png" width={18} className="rounded-circle" />
          <small className="mx-2">Login with Google</small>
        </Button>
      </div>
      <h4><a href="/auth/register">Create Account</a></h4>
    </GuestLayout>
  );
};
const handleLogin = async (
  setUser: (session: LoggedInUserDto | null) => void,
  router: NextRouter
) => {
  if (process.browser) {
    const res = await authService.whoAmI();
    setUser(res.data);
    await router.push("/");
  }
};
export default Login;
