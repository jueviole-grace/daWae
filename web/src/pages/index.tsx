import {
  Box,
  Button,
  Flex,
  Heading,
  Skeleton,
  Stack,
  Text,
  Link,
  IconButton,
} from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import { Layout } from "../components/Layout";
import NextLink from "next/link";
import { useDeletePostMutation, useMeQuery, usePostsQuery } from "../generated/graphql";
import { createURQLClient } from "../utils/createURQLClient";
import { useState } from "react";
import { UpDootSection } from "../components/UpDootSection";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";

const Index = () => {
  const router = useRouter();
  const [, deletePost] = useDeletePostMutation();
  const [{data: myData}] = useMeQuery()
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: null as null | string,
  });
  const [{ data, fetching, stale , error}] = usePostsQuery({
    variables,
  });

  if (!fetching && !data) {
    return <Box>{error?.message}</Box>;
  }
  return (
    <Layout>
      <Flex alignContent={"center"}>
        <Button
          variant={"outline"}
          backgroundColor={"teal.500"}
          mb={8}
          ml={"auto"}
        >
          <NextLink href={"/create-post"}>Create Post</NextLink>
        </Button>
      </Flex>
      {(stale || fetching) && !data ? (
        <Stack>
          <Skeleton height="20px" />
          <Skeleton height="20px" />
          <Skeleton height="20px" />
        </Stack>
      ) : (
        <Stack spacing={8} mb={4}>
          {data!.posts.posts.map((p) => !p ? null : (
            <Flex key={p.id} p={2} shadow="md" borderWidth="1px">
              <UpDootSection post={p} />
              <Box flex={1}>
                <Text fontSize={"xs"} color={"gray.500"}>
                  posted by d\{p.creator.username}
                </Text>
                <NextLink href={"/post/[id]"} as={`/post/${p.id}`}>
                  <Link>
                    <Heading fontSize="xl" fontWeight={"700"}>
                      {p.title}
                    </Heading>
                  </Link>
                </NextLink>
                <Flex alignContent={"center"}>
                  <Text flex={1} mt={4} isTruncated>
                    {p.textSnippet}
                  </Text>
                  { myData?.me?.id === p.creator.id ?
                  <Box>
                    <NextLink href={`post/edit/${p.id}`}>
                    <IconButton
                    aria-label="update post"
                    mr={4}
                    fontSize={24}
                    variant={"outline"}
                    color={"twitter.400"}
                    icon={<EditIcon/>}
                    />
                    </NextLink>
                    <IconButton
                    aria-label="delete post"
                    fontSize={24}
                    variant={"outline"}
                    icon={
                      <DeleteIcon
                      color={"red.400"}
                      onClick={() => {
                        deletePost({ id: p.id });
                      }}
                      />
                    }
                    />
                    </Box>
                    :null
                  }
                  
                </Flex>
              </Box>
            </Flex>
          ))}
        </Stack>
      )}
      {data && data.posts.hasMore ? (
        <Flex>
          <Button
            isLoading={fetching}
            m={"auto"}
            my={8}
            variant={"ghost"}
            backgroundColor={"Highlight"}
            onClick={() => {
              setVariables({
                limit: variables.limit,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
              });
            }}
          >
            Load More...
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};
export default withUrqlClient(createURQLClient, { ssr: true })(Index);
