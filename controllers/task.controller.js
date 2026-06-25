const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const taskModel = require("../models/task.model.js");


module.exports = {
	createTask: asyncHandler(async (req, res) => {
		const { _id } = req.user
		const { title, description, status } = req.body;

		if (!title) {
			throw new ApiError(400, "Title is required");
		}

		const task = await taskModel.create({
			title,
			description,
			status,
			userId: _id,
		});

		return res.status(201).json(
			new ApiResponse(
				201,
				task,
				"Task created successfully"
			)
		);
	}),

	getTasks: asyncHandler(async (req, res) => {
		const { _id } = req.user;

		const {
			page = 1,
			limit = 10,
			status,
		} = req.body;

		const allowedStatus = [
			"all",
			"pending",
			"in_progress",
			"completed",
		];

		if (!status) {
			throw new ApiError(
				400,
				`Status is required. Allowed values: ${allowedStatus.join(", ")}`
			);
		}

		const normalizedStatus = status.toLowerCase();

		if (!allowedStatus.includes(normalizedStatus)) {
			throw new ApiError(
				400,
				`Invalid status. Allowed values: ${allowedStatus.join(", ")}`
			);
		}

		const skip = (Number(page) - 1) * Number(limit);

		const matchStage = {
			userId: _id,
			isDelete: false,
		};

		if (normalizedStatus !== "all") {
			matchStage.status = normalizedStatus;
		}

		const result = await taskModel.aggregate([
			{
				$match: matchStage,
			},
			{
				$facet: {
					tasks: [
						{
							$sort: {
								createdAt: -1,
							},
						},
						{
							$skip: skip,
						},
						{
							$limit: Number(limit),
						},
					],
					totalCount: [
						{
							$count: "count",
						},
					],
				},
			},
		]);

		const tasks = result[0]?.tasks || [];
		const totalTasks =
			result[0]?.totalCount?.[0]?.count || 0;

		return res.status(200).json(
			new ApiResponse(
				200,
				{
					tasks,
					pagination: {
						total: totalTasks,
						page: Number(page),
						limit: Number(limit),
						totalPages: Math.ceil(
							totalTasks / Number(limit)
						),
					},
				},
				"Tasks fetched successfully"
			)
		);
	}),

	getTaskById: asyncHandler(async (req, res) => {
		const task = await taskModel.findOne({
			_id: req.params.id,
			userId: req.user._id,
		});

		if (!task) {
			return res.status(404).json({
				success: false,
				message: "Task not found",
			});
		}

		res.status(200).json({
			success: true,
			data: task,
		});
	}),

	updateTask: asyncHandler(async (req, res) => {
		const {
			taskIds,
			title,
			description,
			status,
		} = req.body;

		if (
			!taskIds ||
			!Array.isArray(taskIds) ||
			taskIds.length === 0
		) {
			throw new ApiError(
				400,
				"taskIds is required and must be a non-empty array"
			);
		}

		const updateData = {};

		if (title !== undefined) {
			updateData.title = title;
		}

		if (description !== undefined) {
			updateData.description = description;
		}

		if (status !== undefined) {
			updateData.status = status;
		}

		await taskModel.updateMany(
			{
				_id: { $in: taskIds },
				isDelete: false,
			},
			{
				$set: updateData,
			}
		);

		return res.status(200).json(
			new ApiResponse(
				200,
				null,
				"Tasks updated successfully"
			)
		);
	}),

	deleteTask: asyncHandler(async (req, res) => {
		const { taskIds } = req.body;

		if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
			throw new ApiError(404, "taskIds is required and must be a non-empty array");
		}

		await taskModel.updateMany(
			{ _id: { $in: taskIds, }, isDelete: false },
			{ $set: { isDelete: true } }
		);

		return res.status(200).json(
			new ApiResponse(
				200,
				null,
				"Task deleted successfully"
			)
		);
	}),

	getTaskStats: asyncHandler(async (req, res) => {
		const { _id } = req.user;

		const [stats] = await taskModel.aggregate([
			{
				$match: {
					userId: _id,
					isDelete: false,
				},
			},
			{
				$group: {
					_id: null,
					total: { $sum: 1 },
					pending: {
						$sum: {
							$cond: [
								{ $eq: ["$status", "pending"] },
								1,
								0,
							],
						},
					},
					inProgress: {
						$sum: {
							$cond: [
								{ $eq: ["$status", "in_progress"] },
								1,
								0,
							],
						},
					},
					completed: {
						$sum: {
							$cond: [
								{ $eq: ["$status", "completed"] },
								1,
								0,
							],
						},
					},
				},
			},
			{
				$project: {
					_id: 0,
					total: 1,
					pending: 1,
					inProgress: 1,
					completed: 1,
				},
			},
		]);

		return res.status(200).json(
			new ApiResponse(
				200,
				stats || {
					total: 0,
					pending: 0,
					inProgress: 0,
					completed: 0,
				},
				"Task stats fetched successfully"
			)
		);
	}),
};