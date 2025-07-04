"use server";

import { signIn } from "@/auth";
import { redirect } from "next/navigation";
type State = {
  message: string | null;
  id?: string;
  name?: string;
  password?: string;
};

const onSubmit = async (
  prevState: State,
  formData: FormData
): Promise<State> => {
  const id = (formData.get("id") as string)?.trim() ?? "";
  const name = (formData.get("name") as string)?.trim() ?? "";
  const password = (formData.get("password") as string)?.trim() ?? "";
  const image = formData.get("image");

  if (!id) return { message: "no_id", id, name, password };
  if (!name) return { message: "no_name", id, name, password };
  if (!password) return { message: "no_password", id, name, password };
  if (!image) return { message: "no_image", id, name, password };

  formData.set("nickname", name);
  let shouldRedirect = false;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/users`,
      {
        method: "post",
        body: formData,
        credentials: "include",
      }
    );
    if (response.status === 403) {
      return { message: "user_exists", id, name, password };
    } else if (response.status === 400) {
      return { message: (await response.json()).data[0], id, name, password };
    }
    await signIn("credentials", {
      id,
      password,
      redirect: false,
    });

    shouldRedirect = true;
  } catch (err) {
    console.error(err);
  }

  if (shouldRedirect) {
    redirect("/home");
  }
  // 실패했지만 오류 없음 → 그대로 반환
  return { message: null, id, name, password };
};

export default onSubmit;
