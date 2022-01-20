import React, { useEffect } from "react";
import { Form, Formik } from "formik";
import authService from "@/app/services/authService";
import InputField from "@/app/components/forminputs/InputField";
import InputSelect from "@/app/components/forminputs/InputSelect";
import { useSession } from "@/app/common/context/sessionContext";
import renderUtils from "@/app/common/utils/renderUtils";
import { LoggedInUserDto } from "@/app/common/dtos/LoggedInUserDto";
import { AppCluster, AppClusterLabel } from "@/app/common/enums/AppCluster";
import { NextRouter, useRouter } from "next/router";
import GuestLayout from "@/app/components/layout/GuestLayout";
import ButtonSubmit from "@/app/components/forminputs/ButtonSubmit";
import * as Yup from "yup";
import { ExternalLoginType } from "@/app/common/enums/ExternalLoginType";
import authUtils from "@/app/common/utils/authUtils";
import buttonHandler from "@/app/common/utils/buttonHandler";
import bannerNotificationService from "@/app/services/bannerNotificationService";
import { GetServerSidePropsContext } from "next";
import { UserRegistrationResponse } from "@/app/common/dtos/UserRegistrationResponse";
import { AxiosResponse } from "axios";

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

function Register(props: serverSideProps) {
  const { setUser } = useSession();
  const router = useRouter();
  const formSchema = Yup.object().shape({
    password: Yup.string().required("This field is required"),
    confirmPassword: Yup.string().when("password", {
      is: (val: string) => (val && val.length > 0 ? true : false),
      then: Yup.string().oneOf(
        [Yup.ref("password")],
        "Passwords need to match"
      ),
    }),
  });

  useEffect(() => {
    if (!router.isReady) return;

    if (router.query.failure_message) {
      bannerNotificationService.error(router.query.failure_message);
    }
  }, [router.isReady]);

  return (
    <GuestLayout>
      <div className="container">
        <div className="row">
          <div className="col col-12 col-md-7">
            <img src='/images/Castled-Logo.png' alt="Castled Logo" className="my-3" />
            <h2>Create your Castled Account</h2>
            <Formik
              initialValues={{
                firstName: "",
                lastName: "",
                password: "",
                confirmPassword: "",
                clusterLocation: AppCluster.US,
              }}
              validationSchema={formSchema}
              onSubmit={(values) => handleRegisterUser(values, setUser, router!)}
            >
              {({ values, setFieldValue, setFieldTouched }) => (
                <Form>
                  <div className="row">
                    <div className="col">
                      <InputField
                        type="string"
                        name="firstName"
                        title="First Name"
                        placeholder="Enter First name"
                      />
                    </div>
                    <div className="col">
                      <InputField
                        type="string"
                        name="lastName"
                        title="Last Name"
                        placeholder="Enter last name"
                      />
                    </div>
                  </div>

                  <InputField
                    type="password"
                    name="password"
                    title="Password"
                    placeholder="Enter password"
                  />

                  <InputField
                    type="password"
                    name="confirmPassword"
                    title="Confirm Password"
                    placeholder="Confirm password"
                  />

                  <InputSelect
                    title="Cluster Location"
                    options={renderUtils.selectOptions(AppClusterLabel)}
                    values={values}
                    setFieldValue={setFieldValue}
                    setFieldTouched={setFieldTouched}
                    name="clusterLocation"
                  />
                  <ButtonSubmit className="form-control btn-lg" >
                    Create Account
                  </ButtonSubmit>
                  <h4 className="mt-3"><a href="/auth/login">Have an account? Sign In</a></h4>
                </Form>
              )}
            </Formik>
          </div>
          <div className="col d-none col-md-5 d-md-flex align-items-center">
            <img src='/images/register.gif' alt="Castled Logo" className="my-3 img-fluid" />
          </div>
        </div>
      </div>
    </GuestLayout>
  );
}

export interface RegisterForm {
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
  clusterLocation: AppCluster;
}

const handleRegisterUser = async (
  registerForm: RegisterForm,
  setUser: (session: LoggedInUserDto | null) => void,
  router: NextRouter
) => {
  if (process.browser) {
    await authService
      .register({
        token: router.query.token as string,
        firstName: registerForm.firstName,
        lastName: registerForm.lastName,
        password: registerForm.password,
        clusterLocation: registerForm.clusterLocation,
      })
      .then((res: AxiosResponse<UserRegistrationResponse>) => {
        router.push(`${res.data.clusterUrl}/auth/login`);
      });
  }
};

export default Register;
